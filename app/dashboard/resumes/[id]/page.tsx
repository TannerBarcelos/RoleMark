import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { getUserAccess, hasResumeAccess, hasCoverLetterAccess } from '@/lib/paywall'
import { ResumeDetail } from '@/components/resume/resume-detail'

export const metadata = { title: 'Resume Details' }

export default async function ResumeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: resume } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!resume) notFound()

  const { data: scores } = await supabase
    .from('resume_scores')
    .select('*')
    .eq('resume_id', id)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)

  const { data: jd } = await supabase
    .from('job_descriptions')
    .select('*')
    .eq('resume_id', id)
    .eq('user_id', user.id)
    .limit(1)
    .single()

  const { data: versions } = await supabase
    .from('resume_versions')
    .select('id, version_number, label, is_current, created_at')
    .eq('resume_id', id)
    .eq('user_id', user.id)
    .order('version_number', { ascending: false })

  const access = await getUserAccess(user.id)
  const canTailor = await hasResumeAccess(user.id, id)
  const canCoverLetter = await hasCoverLetterAccess(user.id, id)

  return (
    <ResumeDetail
      resume={resume}
      score={scores?.[0] || null}
      jobDescription={jd}
      versions={versions || []}
      access={access}
      canTailor={canTailor}
      canCoverLetter={canCoverLetter}
    />
  )
}
