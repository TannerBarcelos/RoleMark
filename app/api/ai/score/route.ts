import { generateText, Output } from 'ai'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const scoreSchema = z.object({
  overall_score: z.number().describe('Overall match score 0-100'),
  scores: z.object({
    keywords: z.number().describe('Keyword match score 0-100'),
    experience: z.number().describe('Experience relevance score 0-100'),
    skills: z.number().describe('Skills alignment score 0-100'),
    education: z.number().describe('Education fit score 0-100'),
    impact: z.number().describe('Overall impact/achievements score 0-100'),
  }),
  weaknesses: z.array(
    z.object({
      area: z.string().describe('The area of weakness'),
      detail: z.string().describe('Specific explanation'),
      severity: z.string().describe('high, medium, or low'),
    })
  ).describe('List of weaknesses found'),
  strengths: z.array(
    z.object({
      area: z.string().describe('The area of strength'),
      detail: z.string().describe('Specific explanation'),
    })
  ).describe('List of strengths found'),
  suggestions: z.array(
    z.object({
      text: z.string().describe('Actionable suggestion'),
      priority: z.string().describe('high, medium, or low'),
    })
  ).describe('Improvement suggestions'),
})

export async function POST(req: Request) {
  try {
    const { resumeId, jobDescriptionId } = await req.json()

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    // Get resume data
    const { data: resume } = await supabase
      .from('resumes')
      .select('original_text, original_file_url')
      .eq('id', resumeId)
      .eq('user_id', user.id)
      .single()

    if (!resume) return Response.json({ error: 'Resume not found' }, { status: 404 })

    // Get job description
    const { data: jd } = await supabase
      .from('job_descriptions')
      .select('raw_text, title')
      .eq('id', jobDescriptionId)
      .eq('user_id', user.id)
      .single()

    if (!jd) return Response.json({ error: 'Job description not found' }, { status: 404 })

    // If resume text not yet extracted, extract it now from the PDF
    let resumeText = resume.original_text
    if (!resumeText && resume.original_file_url) {
      const { data: fileData } = await supabase.storage
        .from('resumes')
        .download(resume.original_file_url)

      if (fileData) {
        // Convert blob to base64 for the AI model to read
        const arrayBuffer = await fileData.arrayBuffer()
        const base64 = Buffer.from(arrayBuffer).toString('base64')

        // Use AI to extract text from PDF
        const extractResult = await generateText({
          model: 'openai/gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'file',
                  data: base64,
                  mediaType: 'application/pdf',
                },
                {
                  type: 'text',
                  text: 'Extract all text content from this resume PDF. Return the full text exactly as it appears, preserving section headers and formatting structure. Only return the extracted text, nothing else.',
                },
              ],
            },
          ],
        })

        resumeText = extractResult.text

        // Save extracted text for future use
        await supabase
          .from('resumes')
          .update({ original_text: resumeText })
          .eq('id', resumeId)
      }
    }

    if (!resumeText) {
      return Response.json({ error: 'Could not extract resume text' }, { status: 400 })
    }

    // Score resume against JD using gpt-4o-mini (free tier model)
    const result = await generateText({
      model: 'openai/gpt-4o-mini',
      output: Output.object({ schema: scoreSchema }),
      system: `You are an expert resume reviewer and ATS specialist. Analyze the provided resume against the job description and score it. Be thorough, specific, and actionable in your analysis. Score each category from 0-100 where:
- 90-100: Excellent match
- 75-89: Good match with minor gaps
- 60-74: Moderate match, needs improvement
- 40-59: Weak match, significant gaps
- 0-39: Poor match

Focus on:
- Keywords: How well does the resume include relevant keywords from the JD?
- Experience: How relevant is the candidate's experience to the role?
- Skills: How well do listed skills match required/preferred skills?
- Education: Does education meet requirements?
- Impact: Does the resume demonstrate measurable achievements and impact?`,
      prompt: `## Resume:
${resumeText}

## Job Description:
${jd.raw_text}

Analyze this resume against the job description. Provide a detailed scoring with specific weaknesses, strengths, and actionable suggestions.`,
    })

    const scoreData = result.output

    if (!scoreData) {
      return Response.json({ error: 'Scoring failed' }, { status: 500 })
    }

    // Save score to database
    const { error: saveError } = await supabase
      .from('resume_scores')
      .insert({
        resume_id: resumeId,
        job_description_id: jobDescriptionId,
        user_id: user.id,
        overall_score: scoreData.overall_score,
        scores: scoreData.scores,
        weaknesses: scoreData.weaknesses,
        strengths: scoreData.strengths,
        suggestions: scoreData.suggestions,
      })

    if (saveError) throw saveError

    return Response.json({ success: true, score: scoreData })
  } catch (err) {
    console.error('Score API error:', err)
    return Response.json(
      { error: err instanceof Error ? err.message : 'Scoring failed' },
      { status: 500 }
    )
  }
}
