import { generateText } from 'ai'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { url } = await req.json()

    if (!url || typeof url !== 'string') {
      return Response.json({ error: 'URL is required' }, { status: 400 })
    }

    // Fetch the page content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RoleMark/1.0)',
      },
    })

    if (!response.ok) {
      return Response.json({ error: 'Failed to fetch URL' }, { status: 400 })
    }

    const html = await response.text()

    // Use AI to extract the job description from the HTML
    const result = await generateText({
      model: 'openai/gpt-4o-mini',
      system: 'You are a job description extractor. Given raw HTML content from a job posting page, extract the complete job description text including: job title, company name, requirements, qualifications, responsibilities, and any other relevant details. Return ONLY the extracted job description text in a clean, readable format. Do not include navigation, footer, or other page elements.',
      prompt: `Extract the job description from this page content:\n\n${html.slice(0, 30000)}`,
    })

    // Try to extract title
    const titleMatch = result.text.match(/^(.+?)[\n\r]/)
    const title = titleMatch ? titleMatch[1].trim().slice(0, 200) : undefined

    return Response.json({ text: result.text, title })
  } catch (err) {
    console.error('Fetch JD error:', err)
    return Response.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch job description' },
      { status: 500 }
    )
  }
}
