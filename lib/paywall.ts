import { createClient } from '@/lib/supabase/server'
import { FREE_UPLOAD_LIMIT } from '@/lib/products'

export type AccessLevel = 'free' | 'one_time' | 'subscriber'

export interface UserAccess {
  level: AccessLevel
  canUpload: boolean
  canScore: boolean
  canTailor: boolean
  canCoverLetter: boolean
  canInlineEdit: boolean
  canVersion: boolean
  canOrganize: boolean
  freeUploadsUsed: number
  freeUploadsRemaining: number
}

export async function getUserAccess(userId: string): Promise<UserAccess> {
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status, subscription_current_period_end, free_uploads_used')
    .eq('id', userId)
    .single()

  const isSubscriber =
    profile?.subscription_status === 'active' &&
    profile?.subscription_current_period_end &&
    new Date(profile.subscription_current_period_end) > new Date()

  const freeUploadsUsed = profile?.free_uploads_used ?? 0

  if (isSubscriber) {
    return {
      level: 'subscriber',
      canUpload: true,
      canScore: true,
      canTailor: true,
      canCoverLetter: true,
      canInlineEdit: true,
      canVersion: true,
      canOrganize: true,
      freeUploadsUsed,
      freeUploadsRemaining: Infinity,
    }
  }

  return {
    level: 'free',
    canUpload: freeUploadsUsed < FREE_UPLOAD_LIMIT,
    canScore: true,
    canTailor: false,
    canCoverLetter: false,
    canInlineEdit: false,
    canVersion: false,
    canOrganize: false,
    freeUploadsUsed,
    freeUploadsRemaining: Math.max(0, FREE_UPLOAD_LIMIT - freeUploadsUsed),
  }
}

export async function hasResumeAccess(
  userId: string,
  resumeId: string
): Promise<boolean> {
  const access = await getUserAccess(userId)

  if (access.level === 'subscriber') return true

  const supabase = await createClient()
  const { data: purchase } = await supabase
    .from('purchases')
    .select('id')
    .eq('user_id', userId)
    .eq('resume_id', resumeId)
    .in('product_type', ['tailored_resume', 'bundle'])
    .eq('status', 'completed')
    .limit(1)
    .single()

  return !!purchase
}

export async function hasCoverLetterAccess(
  userId: string,
  resumeId: string
): Promise<boolean> {
  const access = await getUserAccess(userId)

  if (access.level === 'subscriber') return true

  const supabase = await createClient()
  const { data: purchase } = await supabase
    .from('purchases')
    .select('id')
    .eq('user_id', userId)
    .eq('resume_id', resumeId)
    .in('product_type', ['cover_letter', 'bundle'])
    .eq('status', 'completed')
    .limit(1)
    .single()

  return !!purchase
}
