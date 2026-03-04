'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Plus, FileText, Building2 } from 'lucide-react'

interface ResumesListProps {
  resumes: Array<{
    id: string
    title: string
    status: string
    created_at: string
    company: { id: string; name: string } | null
    score: number | null
  }>
}

function getScoreColor(score: number) {
  if (score >= 80) return 'text-success'
  if (score >= 60) return 'text-warning'
  return 'text-destructive'
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'scored':
      return <Badge variant="secondary" className="bg-primary/10 text-primary">Scored</Badge>
    case 'tailored':
      return <Badge variant="secondary" className="bg-success/10 text-success">Tailored</Badge>
    default:
      return <Badge variant="outline">Uploaded</Badge>
  }
}

export function ResumesList({ resumes }: ResumesListProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Resumes</h1>
          <p className="text-muted-foreground">{resumes.length} resume{resumes.length !== 1 ? 's' : ''}</p>
        </div>
        <Button asChild className="min-h-[44px]">
          <Link href="/dashboard/resumes/new">
            <Plus className="mr-2 h-4 w-4" />
            New Resume
          </Link>
        </Button>
      </div>

      {resumes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <FileText className="h-7 w-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-lg">No resumes yet</p>
              <p className="text-sm text-muted-foreground">Upload your first resume to get started with AI scoring</p>
            </div>
            <Button asChild className="min-h-[44px]">
              <Link href="/dashboard/resumes/new">
                <Plus className="mr-2 h-4 w-4" />
                Upload Resume
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {resumes.map((resume) => (
            <Link key={resume.id} href={`/dashboard/resumes/${resume.id}`}>
              <Card className="hover:border-primary/30 transition-colors cursor-pointer">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{resume.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {resume.company && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Building2 className="h-3 w-3" />
                            {resume.company.name}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {new Date(resume.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {resume.score !== null && (
                      <span className={`text-lg font-bold ${getScoreColor(resume.score)}`}>
                        {resume.score}%
                      </span>
                    )}
                    {getStatusBadge(resume.status)}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
