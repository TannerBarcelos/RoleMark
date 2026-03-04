import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

// Use service role for webhook handler (no user session)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const { userId, productId, resumeId } = session.metadata || {}

        if (!userId || !productId) {
          console.error('Missing metadata in checkout session')
          break
        }

        // Record the purchase
        const purchaseData: Record<string, unknown> = {
          user_id: userId,
          stripe_customer_id: session.customer as string,
          stripe_session_id: session.id,
          product_id: productId,
          amount_cents: session.amount_total,
          status: 'completed',
        }

        // If it's a subscription, add subscription details
        if (session.mode === 'subscription' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          )
          purchaseData.stripe_subscription_id = subscription.id
          purchaseData.subscription_status = subscription.status
          purchaseData.current_period_end = new Date(
            subscription.current_period_end * 1000
          ).toISOString()
        }

        // If there's a resume associated, link it
        if (resumeId) {
          purchaseData.resume_id = resumeId
        }

        const { error: purchaseError } = await supabaseAdmin
          .from('purchases')
          .insert(purchaseData)

        if (purchaseError) {
          console.error('Failed to record purchase:', purchaseError)
        }

        // Update user's subscription tier in profile
        if (session.mode === 'subscription') {
          const tier = productId.includes('yearly') ? 'pro_yearly' : 'pro_monthly'
          await supabaseAdmin
            .from('profiles')
            .update({ subscription_tier: tier })
            .eq('id', userId)
        }

        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        
        // Update the purchase record
        await supabaseAdmin
          .from('purchases')
          .update({
            subscription_status: subscription.status,
            current_period_end: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id)

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        // Mark subscription as canceled
        await supabaseAdmin
          .from('purchases')
          .update({
            subscription_status: 'canceled',
          })
          .eq('stripe_subscription_id', subscription.id)

        // Get user ID from purchase and downgrade them
        const { data: purchase } = await supabaseAdmin
          .from('purchases')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .single()

        if (purchase?.user_id) {
          await supabaseAdmin
            .from('profiles')
            .update({ subscription_tier: 'free' })
            .eq('id', purchase.user_id)
        }

        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        
        if (invoice.subscription) {
          await supabaseAdmin
            .from('purchases')
            .update({ subscription_status: 'past_due' })
            .eq('stripe_subscription_id', invoice.subscription as string)
        }

        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
