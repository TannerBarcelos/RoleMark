import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { CompaniesList } from '@/components/company/companies-list'

export const metadata: Metadata = {
  title: 'Companies',
  description: 'Organize your job applications by company',
}

export default async function CompaniesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Get all companies with resume count
  const { data: companies } = await supabase
    .from('companies')
    .select(`
      *,
      resumes:resumes(count)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Companies</h1>
        <p className="text-muted-foreground">
          Organize your resumes and track applications by company
        </p>
      </div>

      <CompaniesList companies={companies || []} />
    </div>
  )
}
