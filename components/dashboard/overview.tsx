'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { FileText, Plus, Building2, TrendingUp, Zap } from 'lucide-react'
import type { UserAccess } from '@/lib/paywall'

interface DashboardOverviewProps {
  resumes: Array<{
    id: string
    title: string
    status: string
    created_at: string
    company_id: string | null
  }>
  recentScores: Array<{
    id: string
    overall_score: number
    resume_id: string
    created_at: string
  }>
  companies: Array<{
    id: string
    name: string
  }>
  access: UserAccess
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

export function DashboardOverview({ resumes, recentScores, companies, access }: DashboardOverviewProps) {
  const avgScore =
    recentScores.length > 0
      ? Math.round(recentScores.reduce((sum, s) => sum + s.overall_score, 0) / recentScores.length)
      : null

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl text-balance">Dashboard</h1>
          <p className="text-muted-foreground">Manage your resumes and applications</p>
        </div>
        <Button asChild size="lg" className="min-h-[44px]">
          <Link href="/dashboard/resumes/new">
            <Plus className="mr-2 h-5 w-5" />
            New Resume
          </Link>
        </Button>
      </div>

      {/* Subscription upsell for free users */}
      {access.level === 'free' && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Upgrade to Pro</p>
                <p className="text-sm text-muted-foreground">
                  Unlimited uploads, AI tailoring, versioning, and company organization.
                  {access.freeUploadsRemaining === 0 && ' You\'ve used your free upload.'}
                </p>
              </div>
            </div>
            <Button asChild variant="default" className="shrink-0 min-h-[44px]">
              <Link href="/dashboard/billing">View Plans</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resumes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{resumes.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${avgScore ? getScoreColor(avgScore) : 'text-muted-foreground'}`}>
              {avgScore !== null ? `${avgScore}%` : '--'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{companies.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Free Uploads</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {access.level === 'subscriber' ? (
                <span className="text-primary text-lg">Unlimited</span>
              ) : (
                `${access.freeUploadsRemaining}/1`
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent resumes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Resumes</CardTitle>
              <CardDescription>Your latest resume uploads and scores</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm" className="min-h-[44px]">
              <Link href="/dashboard/resumes">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {resumes.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">No resumes yet</p>
                <p className="text-sm text-muted-foreground">Upload your first resume to get started</p>
              </div>
              <Button asChild className="min-h-[44px]">
                <Link href="/dashboard/resumes/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Resume
                </Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {resumes.map((resume) => {
                const score = recentScores.find((s) => s.resume_id === resume.id)
                return (
                  <Link
                    key={resume.id}
                    href={`/dashboard/resumes/${resume.id}`}
                    className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-accent transition-colors min-h-[44px]"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">{resume.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(resume.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {score && (
                        <span className={`text-lg font-bold ${getScoreColor(score.overall_score)}`}>
                          {score.overall_score}%
                        </span>
                      )}
                      {getStatusBadge(resume.status)}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
