import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getUserAccess } from '@/lib/paywall'
import { DashboardOverview } from '@/components/dashboard/overview'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const access = await getUserAccess(user.id)

  const { data: resumes } = await supabase
    .from('resumes')
    .select('id, title, status, created_at, company_id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: recentScores } = await supabase
    .from('resume_scores')
    .select('id, overall_score, resume_id, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: companies } = await supabase
    .from('companies')
    .select('id, name')
    .eq('user_id', user.id)

  return (
    <DashboardOverview
      resumes={resumes || []}
      recentScores={recentScores || []}
      companies={companies || []}
      access={access}
    />
  )
}
