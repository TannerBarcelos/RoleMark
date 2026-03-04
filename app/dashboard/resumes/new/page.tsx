import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getUserAccess } from '@/lib/paywall'
import { ResumeUploadFlow } from '@/components/resume/upload-flow'

export const metadata = { title: 'New Resume' }

export default async function NewResumePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const access = await getUserAccess(user.id)

  const { data: companies } = await supabase
    .from('companies')
    .select('id, name')
    .eq('user_id', user.id)
    .order('name')

  return (
    <ResumeUploadFlow
      userId={user.id}
      access={access}
      companies={companies || []}
    />
  )
}
