import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ResumeEditorWrapper } from '@/components/editor/resume-editor-wrapper'
import { checkAccess } from '@/lib/paywall'

export const metadata: Metadata = {
  title: 'Edit Resume',
  description: 'Edit your tailored resume',
}

export default async function EditResumePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Check if user has access to editing
  const access = await checkAccess(user.id, 'ai_editing')
  
  // Fetch resume
  const { data: resume } = await supabase
    .from('resumes')
    .select(`
      *,
      job_description:job_descriptions(*),
      versions:resume_versions(*)
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!resume) {
    notFound()
  }

  // Convert tailored content to HTML for editor
  const initialContent = resume.tailored_content
    ? generateHTMLFromContent(resume.tailored_content)
    : `<h1>${resume.title || 'Resume'}</h1><p>${resume.original_text || ''}</p>`

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Edit Resume</h1>
          <p className="text-muted-foreground">
            {resume.title} {resume.job_description?.company_name && `- ${resume.job_description.company_name}`}
          </p>
        </div>
      </div>

      <ResumeEditorWrapper
        resumeId={id}
        initialContent={initialContent}
        hasAIAccess={access.allowed}
        versions={resume.versions || []}
      />
    </div>
  )
}

function generateHTMLFromContent(content: Record<string, unknown>): string {
  const parts: string[] = []
  
  // Summary
  if (content.summary) {
    parts.push(`<h2>Professional Summary</h2>`)
    parts.push(`<p>${content.summary}</p>`)
  }

  // Experience
  if (Array.isArray(content.experience)) {
    parts.push(`<h2>Experience</h2>`)
    for (const exp of content.experience as Array<{
      company: string
      title: string
      startDate: string
      endDate: string | null
      bullets: string[]
    }>) {
      parts.push(`<h3>${exp.title} at ${exp.company}</h3>`)
      parts.push(`<p><em>${exp.startDate} - ${exp.endDate || 'Present'}</em></p>`)
      if (exp.bullets?.length) {
        parts.push('<ul>')
        for (const bullet of exp.bullets) {
          parts.push(`<li>${bullet}</li>`)
        }
        parts.push('</ul>')
      }
    }
  }

  // Skills
  if (content.skills && typeof content.skills === 'object') {
    const skills = content.skills as {
      technical?: string[]
      soft?: string[]
      tools?: string[]
    }
    parts.push(`<h2>Skills</h2>`)
    if (skills.technical?.length) {
      parts.push(`<p><strong>Technical:</strong> ${skills.technical.join(', ')}</p>`)
    }
    if (skills.soft?.length) {
      parts.push(`<p><strong>Soft Skills:</strong> ${skills.soft.join(', ')}</p>`)
    }
    if (skills.tools?.length) {
      parts.push(`<p><strong>Tools:</strong> ${skills.tools.join(', ')}</p>`)
    }
  }

  // Education
  if (Array.isArray(content.education)) {
    parts.push(`<h2>Education</h2>`)
    for (const edu of content.education as Array<{
      institution: string
      degree: string
      field: string
      graduationDate: string
    }>) {
      parts.push(`<h3>${edu.degree} in ${edu.field}</h3>`)
      parts.push(`<p>${edu.institution} - ${edu.graduationDate}</p>`)
    }
  }

  return parts.join('\n')
}
