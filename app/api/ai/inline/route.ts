import { NextRequest } from 'next/server'
import { streamText } from 'ai'
import { createClient } from '@/lib/supabase/server'
import { checkAccess } from '@/lib/paywall'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Check if user has access to inline AI editing
  const access = await checkAccess(user.id, 'ai_editing')
  if (!access.allowed) {
    return new Response(JSON.stringify({
      error: 'Premium feature',
      message: access.message,
      upgradeRequired: true,
    }), { status: 403 })
  }

  const { text, action, context } = await req.json()

  if (!text || !action) {
    return new Response('Missing required fields', { status: 400 })
  }

  const actionPrompts: Record<string, string> = {
    improve: `Improve this text to be more impactful and professional. Keep the same meaning but enhance the language, use stronger action verbs, and add metrics if contextually appropriate:\n\n${text}`,
    
    shorten: `Make this text more concise while preserving the key information and impact. Remove filler words and redundancy:\n\n${text}`,
    
    expand: `Expand this text with more detail and specificity. Add relevant context, metrics, or examples that would strengthen it:\n\n${text}`,
    
    quantify: `Add specific metrics, numbers, or quantifiable achievements to this text. If exact numbers aren't available, suggest reasonable estimates based on typical outcomes:\n\n${text}`,
    
    actionVerbs: `Rewrite this text using stronger action verbs at the beginning. Focus on verbs like "Led," "Achieved," "Implemented," "Increased," "Reduced," "Developed," etc.:\n\n${text}`,
    
    ats: `Optimize this text for ATS (Applicant Tracking Systems) while keeping it readable. Include relevant keywords and standard terminology:\n\n${text}`,
    
    custom: `${context || 'Improve this text'}:\n\n${text}`,
  }

  const prompt = actionPrompts[action] || actionPrompts.improve

  const result = streamText({
    model: 'openai/gpt-4o',
    system: `You are an expert resume writer. Your task is to enhance resume content.

Rules:
1. Only output the improved text, no explanations
2. Maintain the same format (bullet point, paragraph, etc.)
3. Keep it truthful - enhance presentation, don't fabricate
4. Use professional, achievement-focused language
5. Be concise but impactful`,
    prompt,
  })

  return result.toTextStreamResponse()
}
