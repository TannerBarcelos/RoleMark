import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { BillingOverview } from '@/components/billing/billing-overview'

export const metadata: Metadata = {
  title: 'Billing',
  description: 'Manage your subscription and billing',
}

export default async function BillingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Get profile with subscription info
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get purchase history
  const { data: purchases } = await supabase
    .from('purchases')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Get resume count for free tier tracking
  const { count: resumeCount } = await supabase
    .from('resumes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and view purchase history
        </p>
      </div>

      <BillingOverview
        profile={profile}
        purchases={purchases || []}
        resumeCount={resumeCount || 0}
      />
    </div>
  )
}
