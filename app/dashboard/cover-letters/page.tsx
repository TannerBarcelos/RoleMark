import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { CoverLettersList } from '@/components/cover-letter/cover-letters-list'

export const metadata: Metadata = {
  title: 'Cover Letters',
  description: 'View and manage your AI-generated cover letters',
}

export default async function CoverLettersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: coverLetters } = await supabase
    .from('cover_letters')
    .select(`
      *,
      resume:resumes(id, title),
      job_description:job_descriptions(id, role_title, company_name)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Cover Letters</h1>
        <p className="text-muted-foreground">
          AI-generated cover letters tailored to each job application
        </p>
      </div>

      <CoverLettersList coverLetters={coverLetters || []} />
    </div>
  )
}
