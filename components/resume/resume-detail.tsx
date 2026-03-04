'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Wand2,
  FileText,
  PenTool,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  ArrowRight,
  Lock,
  Zap,
  GitBranch,
} from 'lucide-react'
import type { UserAccess } from '@/lib/paywall'

interface ResumeDetailProps {
  resume: {
    id: string
    title: string
    status: string
    created_at: string
    original_file_url: string | null
  }
  score: {
    id: string
    overall_score: number
    scores: Record<string, number>
    weaknesses: Array<{ area: string; detail: string; severity: string }>
    strengths: Array<{ area: string; detail: string }>
    suggestions: Array<{ text: string; priority: string }>
  } | null
  jobDescription: {
    id: string
    title: string | null
    raw_text: string
    company_name: string | null
  } | null
  versions: Array<{
    id: string
    version_number: number
    label: string | null
    is_current: boolean
    created_at: string
  }>
  access: UserAccess
  canTailor: boolean
  canCoverLetter: boolean
}

function getScoreColor(score: number) {
  if (score >= 80) return 'text-success'
  if (score >= 60) return 'text-warning'
  return 'text-destructive'
}

function getScoreBg(score: number) {
  if (score >= 80) return 'bg-success'
  if (score >= 60) return 'bg-warning'
  return 'bg-destructive'
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case 'high': return 'text-destructive'
    case 'medium': return 'text-warning'
    default: return 'text-muted-foreground'
  }
}

const scoreLabels: Record<string, string> = {
  keywords: 'Keyword Match',
  experience: 'Experience Relevance',
  skills: 'Skills Alignment',
  education: 'Education Fit',
  impact: 'Impact & Achievements',
}

export function ResumeDetail({
  resume,
  score,
  jobDescription,
  versions,
  access,
  canTailor,
  canCoverLetter,
}: ResumeDetailProps) {
  const router = useRouter()

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl text-balance">{resume.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            {jobDescription?.title && (
              <span className="text-sm text-muted-foreground">{jobDescription.title}</span>
            )}
            <span className="text-xs text-muted-foreground">
              {new Date(resume.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          {versions.length > 0 && (
            <Button asChild variant="outline" className="min-h-[44px]">
              <Link href={`/dashboard/resumes/${resume.id}/editor`}>
                <PenTool className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
          )}
        </div>
      </div>

      {score ? (
        <>
          {/* Overall Score */}
          <Card>
            <CardContent className="flex flex-col items-center gap-4 p-8">
              <div className="relative flex h-28 w-28 items-center justify-center">
                <svg className="absolute inset-0" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" className="text-muted" strokeWidth="8" />
                  <circle
                    cx="60" cy="60" r="54" fill="none"
                    className={getScoreBg(score.overall_score)}
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(score.overall_score / 100) * 339.292} 339.292`}
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <span className={`text-3xl font-bold ${getScoreColor(score.overall_score)}`}>
                  {score.overall_score}
                </span>
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground text-lg">
                  {score.overall_score >= 80 ? 'Strong Match' :
                   score.overall_score >= 60 ? 'Good Match' :
                   score.overall_score >= 40 ? 'Moderate Match' : 'Needs Work'}
                </p>
                <p className="text-sm text-muted-foreground">Overall resume-to-role fit</p>
              </div>
            </CardContent>
          </Card>

          {/* Score Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Score Breakdown</CardTitle>
              <CardDescription>How your resume scores in each category</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {Object.entries(score.scores).map(([key, value]) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{scoreLabels[key] || key}</span>
                    <span className={`text-sm font-bold ${getScoreColor(value)}`}>{value}%</span>
                  </div>
                  <Progress value={value} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Weaknesses */}
          {score.weaknesses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Weaknesses
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {score.weaknesses.map((w, i) => (
                  <div key={i} className="flex gap-3 rounded-lg border border-border p-3">
                    <div className="shrink-0 mt-0.5">
                      <Badge variant="outline" className={getSeverityColor(w.severity)}>
                        {w.severity}
                      </Badge>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{w.area}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{w.detail}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Strengths */}
          {score.strengths.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {score.strengths.map((s, i) => (
                  <div key={i} className="flex gap-3 rounded-lg border border-border p-3">
                    <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">{s.area}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{s.detail}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Suggestions */}
          {score.suggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {score.suggestions.map((s, i) => (
                  <div key={i} className="flex gap-3 items-start p-2">
                    <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">{s.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* CTA: Tailor Resume */}
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Wand2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Get an AI-Tailored Resume</p>
                  <p className="text-sm text-muted-foreground">
                    {canTailor
                      ? 'Generate a resume optimized for this role with AI, then edit it to perfection.'
                      : 'Unlock AI tailoring to create a resume optimized for this specific role.'}
                  </p>
                </div>
              </div>
              {canTailor ? (
                <Button
                  onClick={() => router.push(`/dashboard/resumes/${resume.id}/editor?generate=true`)}
                  className="min-h-[44px] shrink-0"
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Tailored Resume
                </Button>
              ) : (
                <Button
                  onClick={() => router.push(`/dashboard/billing?resume=${resume.id}`)}
                  className="min-h-[44px] shrink-0"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  {access.level === 'free' ? 'Unlock ($4.99)' : 'Purchase'}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Upsell for non-subscribers */}
          {access.level !== 'subscriber' && (
            <Card className="border-sidebar-border bg-sidebar text-sidebar-foreground">
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-sidebar-primary" />
                  <p className="font-semibold text-sidebar-foreground">
                    {"Applying to multiple roles?"}
                  </p>
                </div>
                <p className="text-sm text-sidebar-foreground/70">
                  {"With Pro, you get unlimited uploads, AI tailoring, cover letters, resume versioning, and company organization. Stop paying per resume and cover every application."}
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button asChild variant="default" className="min-h-[44px] bg-sidebar-primary hover:bg-sidebar-primary/90">
                    <Link href="/dashboard/billing">
                      Start Pro at $12.99/mo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <div className="flex items-center gap-2 text-xs text-sidebar-foreground/50">
                    <GitBranch className="h-3.5 w-3.5" />
                    <span>Versioning</span>
                    <FileText className="h-3.5 w-3.5 ml-2" />
                    <span>Cover Letters</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <FileText className="h-10 w-10 text-muted-foreground" />
            <div>
              <p className="font-semibold text-foreground">No score yet</p>
              <p className="text-sm text-muted-foreground">
                This resume has not been scored against a job description yet.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
