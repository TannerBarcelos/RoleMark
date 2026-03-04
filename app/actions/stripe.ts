'use server'

import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { PRODUCTS, type ProductId } from '@/lib/products'

export async function createCheckoutSession(productId: ProductId, resumeId?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const product = PRODUCTS.find(p => p.id === productId)
  if (!product) {
    return { error: 'Product not found' }
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  try {
    // For subscriptions, use subscription mode
    if (product.type === 'subscription') {
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: product.name,
                description: product.description,
              },
              unit_amount: product.priceInCents,
              recurring: {
                interval: product.interval || 'month',
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${baseUrl}/dashboard/billing/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/dashboard/billing?canceled=true`,
        customer_email: user.email,
        metadata: {
          userId: user.id,
          productId: product.id,
          resumeId: resumeId || '',
        },
      })

      return { sessionId: session.id, url: session.url }
    }

    // For one-time purchases
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.priceInCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: resumeId 
        ? `${baseUrl}/dashboard/resumes/${resumeId}?canceled=true`
        : `${baseUrl}/dashboard/billing?canceled=true`,
      customer_email: user.email,
      metadata: {
        userId: user.id,
        productId: product.id,
        resumeId: resumeId || '',
      },
    })

    return { sessionId: session.id, url: session.url }
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return { error: 'Failed to create checkout session' }
  }
}

export async function getCustomerPortalUrl() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Get the customer's Stripe ID from purchases
  const { data: purchase } = await supabase
    .from('purchases')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .not('stripe_customer_id', 'is', null)
    .single()

  if (!purchase?.stripe_customer_id) {
    return { error: 'No billing history found' }
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: purchase.stripe_customer_id,
      return_url: `${baseUrl}/dashboard/billing`,
    })

    return { url: session.url }
  } catch (error) {
    console.error('Portal error:', error)
    return { error: 'Failed to create portal session' }
  }
}
