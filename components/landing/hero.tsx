import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, FileText, Target, Sparkles } from 'lucide-react'

export function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--color-primary)_0%,transparent_50%)] opacity-[0.08]" />

      <div className="mx-auto max-w-6xl px-4 lg:px-6 pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="flex flex-col items-center text-center gap-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Resume Intelligence
          </div>

          {/* Headline */}
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
            Every role deserves the right resume
          </h1>

          {/* Sub-headline */}
          <p className="max-w-2xl text-lg text-muted-foreground lg:text-xl text-pretty leading-relaxed">
            Upload your resume, paste a job description, and get an instant AI score with actionable insights. 
            Then let AI tailor your resume to land the interview.
          </p>

          {/* CTAs */}
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button asChild size="lg" className="min-h-[52px] px-8 text-base">
              <Link href="/auth/login">
                Start Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-h-[52px] px-8 text-base">
              <a href="#how-it-works">See How It Works</a>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Free score for your first resume. No credit card required.
          </p>

          {/* Visual mockup */}
          <div className="mt-8 w-full max-w-4xl border border-border bg-card p-4 lg:p-6 shadow-2xl shadow-primary/5">
            <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
              {/* Resume side */}
              <div className="flex-1 border border-border bg-background p-4">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Your Resume</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="h-3 w-3/4 bg-muted" />
                  <div className="h-3 w-full bg-muted" />
                  <div className="h-3 w-5/6 bg-muted" />
                  <div className="h-3 w-2/3 bg-muted" />
                  <div className="h-3 w-4/5 bg-muted" />
                  <div className="mt-2 h-3 w-1/2 bg-muted" />
                  <div className="h-3 w-full bg-muted" />
                  <div className="h-3 w-3/4 bg-muted" />
                </div>
              </div>

              {/* Arrow / score */}
              <div className="flex items-center justify-center lg:flex-col">
                <div className="flex h-16 w-16 items-center justify-center bg-primary/10 border-2 border-primary">
                  <span className="text-xl font-bold text-primary">87</span>
                </div>
              </div>

              {/* JD side */}
              <div className="flex-1 border border-border bg-background p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Job Description</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="h-3 w-2/3 bg-muted" />
                  <div className="h-3 w-full bg-muted" />
                  <div className="h-3 w-4/5 bg-muted" />
                  <div className="h-3 w-3/4 bg-muted" />
                  <div className="mt-2 h-3 w-1/2 bg-muted" />
                  <div className="h-3 w-5/6 bg-muted" />
                  <div className="h-3 w-full bg-muted" />
                  <div className="h-3 w-2/3 bg-muted" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
