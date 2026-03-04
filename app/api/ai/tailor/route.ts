import { NextRequest, NextResponse } from 'next/server'
import { generateText, Output } from 'ai'
import { createClient } from '@/lib/supabase/server'
import { checkAccess } from '@/lib/paywall'
import { z } from 'zod'

const tailoredResumeSchema = z.object({
  summary: z.string().describe('A compelling professional summary tailored to the role'),
  experience: z.array(z.object({
    company: z.string(),
    title: z.string(),
    startDate: z.string(),
    endDate: z.string().nullable(),
    bullets: z.array(z.string()).describe('Achievement-focused bullet points with metrics where possible'),
  })),
  skills: z.object({
    technical: z.array(z.string()),
    soft: z.array(z.string()),
    tools: z.array(z.string()),
  }),
  education: z.array(z.object({
    institution: z.string(),
    degree: z.string(),
    field: z.string(),
    graduationDate: z.string(),
  })),
  suggestions: z.array(z.string()).describe('Additional suggestions for the candidate'),
})

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if user has access to this premium feature
  const access = await checkAccess(user.id, 'tailored_resume')
  if (!access.allowed) {
    return NextResponse.json({
      error: 'Premium feature',
      message: access.message,
      upgradeRequired: true,
    }, { status: 403 })
  }

  const { resumeId, jobDescriptionId } = await req.json()

  if (!resumeId || !jobDescriptionId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Fetch resume data
  const { data: resume } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', resumeId)
    .eq('user_id', user.id)
    .single()

  if (!resume) {
    return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
  }

  // Fetch job description
  const { data: jd } = await supabase
    .from('job_descriptions')
    .select('*')
    .eq('id', jobDescriptionId)
    .single()

  if (!jd) {
    return NextResponse.json({ error: 'Job description not found' }, { status: 404 })
  }

  try {
    const { output } = await generateText({
      model: 'openai/gpt-4o',
      output: Output.object({ schema: tailoredResumeSchema }),
      system: `You are an expert resume writer and career coach. Your task is to transform the original resume into a highly tailored version optimized for the specific job description.

Key principles:
1. Mirror the language and keywords from the job description
2. Emphasize relevant experience and achievements
3. Quantify accomplishments with metrics where possible
4. Use action verbs and achievement-focused language
5. Ensure ATS (Applicant Tracking System) compatibility
6. Maintain truthfulness - enhance presentation, don't fabricate

The output should be a complete, polished resume that positions the candidate as an ideal fit for the role.`,
      prompt: `ORIGINAL RESUME:
${resume.original_text}

JOB DESCRIPTION:
Company: ${jd.company_name || 'Not specified'}
Role: ${jd.role_title || 'Not specified'}
Description:
${jd.content}

Please create a tailored resume that:
1. Highlights the most relevant experience for this specific role
2. Uses keywords and phrases from the job description
3. Reorders and rephrases bullet points to emphasize relevant achievements
4. Crafts a compelling summary targeting this exact position
5. Organizes skills to prioritize those mentioned in the job description`,
    })

    if (!output) {
      throw new Error('Failed to generate tailored resume')
    }

    // Create a new version of the resume
    const { data: newVersion, error: versionError } = await supabase
      .from('resume_versions')
      .insert({
        resume_id: resumeId,
        version_number: (resume.current_version || 0) + 1,
        content: output,
        changes_description: `Tailored for ${jd.role_title || 'role'} at ${jd.company_name || 'company'}`,
      })
      .select()
      .single()

    if (versionError) {
      console.error('Failed to save version:', versionError)
    }

    // Update resume with new version
    await supabase
      .from('resumes')
      .update({
        tailored_content: output,
        current_version: (resume.current_version || 0) + 1,
        is_tailored: true,
      })
      .eq('id', resumeId)

    return NextResponse.json({
      success: true,
      tailoredResume: output,
      versionId: newVersion?.id,
    })
  } catch (error) {
    console.error('Tailor error:', error)
    return NextResponse.json(
      { error: 'Failed to generate tailored resume' },
      { status: 500 }
    )
  }
}
