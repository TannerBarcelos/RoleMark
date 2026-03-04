'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { createCheckoutSession } from '@/app/actions/stripe'
import type { ProductId } from '@/lib/products'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

interface CheckoutButtonProps {
  productId: ProductId
  resumeId?: string
  children: React.ReactNode
  variant?: 'default' | 'secondary' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  className?: string
}

export function CheckoutButton({
  productId,
  resumeId,
  children,
  variant = 'default',
  size = 'default',
  className,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const result = await createCheckoutSession(productId, resumeId)
      
      if (result.error) {
        console.error(result.error)
        return
      }

      if (result.url) {
        window.location.href = result.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading}
      variant={variant}
      size={size}
      className={className}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        children
      )}
    </Button>
  )
}

interface EmbeddedCheckoutComponentProps {
  productId: ProductId
  resumeId?: string
}

export function EmbeddedCheckoutComponent({
  productId,
  resumeId,
}: EmbeddedCheckoutComponentProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const initCheckout = async () => {
    setLoading(true)
    try {
      const result = await createCheckoutSession(productId, resumeId)
      if (result.sessionId) {
        // For embedded checkout, we need to fetch the client secret
        const response = await fetch(`/api/stripe/session/${result.sessionId}`)
        const data = await response.json()
        setClientSecret(data.clientSecret)
      }
    } catch (error) {
      console.error('Failed to init checkout:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!clientSecret) {
    return (
      <Button onClick={initCheckout} disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Preparing checkout...
          </>
        ) : (
          'Start Checkout'
        )}
      </Button>
    )
  }

  return (
    <EmbeddedCheckoutProvider
      stripe={stripePromise}
      options={{ clientSecret }}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  )
}
