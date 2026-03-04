import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Plus, Building2, FileText, ExternalLink, Target } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export const metadata: Metadata = {
  title: 'Company Details',
  description: 'View resumes and applications for this company',
}

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Get company with resumes
  const { data: company } = await supabase
    .from('companies')
    .select(`
      *,
      resumes(
        id,
        title,
        created_at,
        resume_scores(overall_score)
      )
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!company) {
    notFound()
  }

  const statusColors: Record<string, string> = {
    researching: 'bg-muted text-muted-foreground',
    applying: 'bg-primary/10 text-primary',
    interviewing: 'bg-warning/10 text-warning',
    offer: 'bg-success/10 text-success',
    rejected: 'bg-destructive/10 text-destructive',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/companies">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              {company.name}
            </h1>
            <Badge
              variant="secondary"
              className={statusColors[company.status] || statusColors.researching}
            >
              {company.status}
            </Badge>
          </div>
          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:underline flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              {company.website}
            </a>
          )}
        </div>
        <Button asChild>
          <Link href={`/dashboard/resumes/new?company=${company.id}`}>
            <Plus className="h-4 w-4 mr-2" />
            New Resume
          </Link>
        </Button>
      </div>

      {/* Notes */}
      {company.notes && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{company.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Resumes for this company */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Resumes</h2>
        {company.resumes?.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No resumes yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create a tailored resume for {company.name}
              </p>
              <Button asChild>
                <Link href={`/dashboard/resumes/new?company=${company.id}`}>
                  Create Resume
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {company.resumes?.map((resume: {
              id: string
              title: string
              created_at: string
              resume_scores: { overall_score: number }[]
            }) => {
              const score = resume.resume_scores?.[0]?.overall_score
              return (
                <Card key={resume.id} className="hover:border-primary/50 transition-colors">
                  <Link href={`/dashboard/resumes/${resume.id}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{resume.title}</CardTitle>
                        {score !== undefined && (
                          <Badge
                            variant={score >= 80 ? 'default' : score >= 60 ? 'secondary' : 'outline'}
                            className="flex items-center gap-1"
                          >
                            <Target className="h-3 w-3" />
                            {score}%
                          </Badge>
                        )}
                      </div>
                      <CardDescription>
                        Created {formatDistanceToNow(new Date(resume.created_at), { addSuffix: true })}
                      </CardDescription>
                    </CardHeader>
                  </Link>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
