import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ResumesList } from '@/components/resume/resumes-list'

export const metadata = { title: 'Resumes' }

export default async function ResumesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: resumes } = await supabase
    .from('resumes')
    .select(`
      id, title, status, created_at, updated_at, company_id,
      companies:company_id (id, name)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const { data: scores } = await supabase
    .from('resume_scores')
    .select('resume_id, overall_score')
    .eq('user_id', user.id)

  const scoreMap = new Map(
    (scores || []).map((s) => [s.resume_id, s.overall_score])
  )

  return (
    <ResumesList
      resumes={(resumes || []).map((r) => ({
        ...r,
        company: r.companies as { id: string; name: string } | null,
        score: scoreMap.get(r.id) ?? null,
      }))}
    />
  )
}
