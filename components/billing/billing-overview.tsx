'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckoutButton } from './checkout'
import { getCustomerPortalUrl } from '@/app/actions/stripe'
import { PRODUCTS, SUBSCRIPTION_PRODUCTS, ONE_TIME_PRODUCTS } from '@/lib/products'
import { Check, Crown, Sparkles, Zap, Loader2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface BillingOverviewProps {
  profile: {
    subscription_tier: string
    free_uploads_used: number
  } | null
  purchases: Array<{
    id: string
    product_id: string
    amount_cents: number
    status: string
    subscription_status: string | null
    current_period_end: string | null
    created_at: string
  }>
  resumeCount: number
}

export function BillingOverview({ profile, purchases, resumeCount }: BillingOverviewProps) {
  const [portalLoading, setPortalLoading] = useState(false)
  const tier = profile?.subscription_tier || 'free'
  const isPro = tier === 'pro_monthly' || tier === 'pro_yearly'
  const freeUploadsUsed = profile?.free_uploads_used || 0

  const activeSubscription = purchases.find(
    p => p.subscription_status === 'active' || p.subscription_status === 'trialing'
  )

  const handleManageSubscription = async () => {
    setPortalLoading(true)
    try {
      const result = await getCustomerPortalUrl()
      if (result.url) {
        window.location.href = result.url
      }
    } catch (error) {
      console.error('Portal error:', error)
    } finally {
      setPortalLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Current Plan
                {isPro && <Crown className="h-5 w-5 text-primary" />}
              </CardTitle>
              <CardDescription>
                {isPro 
                  ? 'You have full access to all features'
                  : 'Upgrade to unlock unlimited resumes and AI features'
                }
              </CardDescription>
            </div>
            <Badge variant={isPro ? 'default' : 'secondary'} className="text-sm">
              {tier === 'pro_yearly' ? 'Pro Yearly' : tier === 'pro_monthly' ? 'Pro Monthly' : 'Free'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Resumes Created</p>
              <p className="text-2xl font-bold">{resumeCount}</p>
              {!isPro && (
                <p className="text-xs text-muted-foreground mt-1">
                  {freeUploadsUsed}/1 free upload used
                </p>
              )}
            </div>
            {activeSubscription && (
              <>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-2xl font-bold capitalize">
                    {activeSubscription.subscription_status}
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Renews</p>
                  <p className="text-2xl font-bold">
                    {activeSubscription.current_period_end
                      ? formatDistanceToNow(new Date(activeSubscription.current_period_end), { addSuffix: true })
                      : '-'
                    }
                  </p>
                </div>
              </>
            )}
          </div>

          {isPro && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={handleManageSubscription}
              disabled={portalLoading}
            >
              {portalLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Manage Subscription'
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Subscription Plans */}
      {!isPro && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Upgrade to Pro</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {SUBSCRIPTION_PRODUCTS.map((product) => (
              <Card key={product.id} className={product.popular ? 'border-primary' : ''}>
                {product.popular && (
                  <div className="bg-primary text-primary-foreground text-center text-sm py-1 rounded-t-lg">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    {product.name}
                  </CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">
                      ${(product.priceInCents / 100).toFixed(2)}
                    </span>
                    <span className="text-muted-foreground">
                      /{product.interval === 'year' ? 'year' : 'month'}
                    </span>
                    {product.interval === 'year' && (
                      <Badge variant="secondary" className="ml-2">
                        Save 36%
                      </Badge>
                    )}
                  </div>

                  <ul className="space-y-2 mb-6">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <CheckoutButton
                    productId={product.id}
                    variant={product.popular ? 'default' : 'outline'}
                    className="w-full"
                  >
                    Subscribe Now
                  </CheckoutButton>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* One-Time Purchases */}
      {!isPro && (
        <div>
          <h2 className="text-lg font-semibold mb-4">One-Time Purchases</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Not ready for a subscription? Purchase individual features.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {ONE_TIME_PRODUCTS.map((product) => (
              <Card key={product.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    {product.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold">
                      ${(product.priceInCents / 100).toFixed(2)}
                    </span>
                    <CheckoutButton productId={product.id} variant="outline" size="sm">
                      Buy
                    </CheckoutButton>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Purchase History */}
      {purchases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Purchase History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {purchases.map((purchase) => {
                const product = PRODUCTS.find(p => p.id === purchase.product_id)
                return (
                  <div
                    key={purchase.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium">{product?.name || purchase.product_id}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(purchase.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${((purchase.amount_cents || 0) / 100).toFixed(2)}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {purchase.status}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
