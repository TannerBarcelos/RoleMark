import { NextRequest, NextResponse } from 'next/server'
import { generateText, Output } from 'ai'
import { createClient } from '@/lib/supabase/server'
import { checkAccess } from '@/lib/paywall'
import { z } from 'zod'

const coverLetterSchema = z.object({
  greeting: z.string().describe('Professional greeting'),
  opening: z.string().describe('Compelling opening paragraph that hooks the reader'),
  body: z.array(z.string()).describe('2-3 body paragraphs highlighting relevant experience'),
  closing: z.string().describe('Strong closing paragraph with call to action'),
  signature: z.string().describe('Professional sign-off'),
})

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if user has access to this premium feature
  const access = await checkAccess(user.id, 'cover_letter')
  if (!access.allowed) {
    return NextResponse.json({
      error: 'Premium feature',
      message: access.message,
      upgradeRequired: true,
    }, { status: 403 })
  }

  const { resumeId, jobDescriptionId, tone = 'professional', additionalNotes } = await req.json()

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

  // Get user profile for name
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const toneInstructions = {
    professional: 'Write in a professional, polished tone suitable for corporate environments.',
    conversational: 'Write in a warm, conversational tone while maintaining professionalism.',
    enthusiastic: 'Write with genuine enthusiasm and energy while remaining professional.',
    formal: 'Write in a formal, traditional business tone.',
  }

  try {
    const { output } = await generateText({
      model: 'openai/gpt-4o',
      output: Output.object({ schema: coverLetterSchema }),
      system: `You are an expert cover letter writer who creates compelling, personalized cover letters that get interviews.

Key principles:
1. Open with a hook that captures attention
2. Show genuine knowledge of the company
3. Connect your experience directly to their needs
4. Use specific examples and achievements
5. Demonstrate enthusiasm without being over-the-top
6. Keep it concise - aim for 3-4 paragraphs
7. End with a confident call to action

${toneInstructions[tone as keyof typeof toneInstructions] || toneInstructions.professional}`,
      prompt: `Write a cover letter for this candidate:

CANDIDATE NAME: ${profile?.full_name || 'Candidate'}

RESUME:
${resume.tailored_content ? JSON.stringify(resume.tailored_content) : resume.original_text}

JOB DETAILS:
Company: ${jd.company_name || 'the company'}
Role: ${jd.role_title || 'this position'}
Description:
${jd.content}

${additionalNotes ? `ADDITIONAL NOTES FROM CANDIDATE:\n${additionalNotes}` : ''}

Create a compelling cover letter that:
1. Shows the candidate did their research on the company
2. Connects their specific experience to the role requirements
3. Highlights 2-3 key achievements relevant to this position
4. Expresses genuine interest in this specific opportunity
5. Ends with a confident call to action`,
    })

    if (!output) {
      throw new Error('Failed to generate cover letter')
    }

    // Save cover letter to database
    const { data: coverLetter, error: saveError } = await supabase
      .from('cover_letters')
      .insert({
        user_id: user.id,
        resume_id: resumeId,
        job_description_id: jobDescriptionId,
        content: output,
        tone,
      })
      .select()
      .single()

    if (saveError) {
      console.error('Failed to save cover letter:', saveError)
    }

    return NextResponse.json({
      success: true,
      coverLetter: output,
      coverLetterId: coverLetter?.id,
    })
  } catch (error) {
    console.error('Cover letter error:', error)
    return NextResponse.json(
      { error: 'Failed to generate cover letter' },
      { status: 500 }
    )
  }
}
