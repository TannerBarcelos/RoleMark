import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star, CheckCircle2 } from 'lucide-react'
import { CornerButton } from '@/components/ui/corner-button'
import { featureFlags } from '@/lib/feature-flags'

export function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/[0.03] blur-[100px] rounded-full" />
      </div>

      <div className="mx-auto max-w-6xl px-4 lg:px-6 pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="flex flex-col items-center text-center gap-6">
          {/* Social proof pill - behind feature flag */}
          {featureFlags.showTrustBadge && (
            <div className="inline-flex items-center gap-2 border border-border bg-card/50 backdrop-blur-sm px-4 py-2 text-sm">
              <div className="flex -space-x-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              </div>
              <span className="text-muted-foreground">Trusted by 10,000+ job seekers</span>
            </div>
          )}

          {/* Headline - outcome focused */}
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance leading-[1.1]">
            Land more interviews with{' '}
            <span className="text-primary">tailored resumes</span>
          </h1>

          {/* Sub-headline - specific benefit */}
          <p className="max-w-2xl text-lg text-muted-foreground lg:text-xl text-pretty leading-relaxed">
            Score your resume against any job description in seconds. Get actionable suggestions 
            to beat applicant tracking systems and stand out to hiring managers.
          </p>

          {/* CTAs */}
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-4 mt-2">
            <Link href="/auth/login">
              <CornerButton className="min-h-[52px] px-8 text-base gap-2">
                Score My Resume Free
                <ArrowRight className="h-4 w-4" />
              </CornerButton>
            </Link>
            <a href="#how-it-works">
              <CornerButton variant="ghost" className="min-h-[52px] px-8 text-base border border-border">
                See How It Works
              </CornerButton>
            </a>
          </div>

          {/* Trust signals - inline */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Results in 30 seconds
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              ATS-optimized suggestions
            </span>
          </div>

          {/* App Screenshot */}
          <div className="relative mt-12 w-full max-w-5xl">
            {/* Glow effect behind image */}
            <div className="absolute inset-0 bg-primary/10 blur-3xl -z-10 scale-95" />
            
            {/* Screenshot container */}
            <div className="relative border border-border bg-card overflow-hidden shadow-2xl shadow-black/20">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-background/50 border border-border px-3 py-1.5 text-xs text-muted-foreground max-w-md mx-auto">
                    app.rolemark.io/dashboard
                  </div>
                </div>
              </div>
              
              {/* Screenshot */}
              <Image
                src="/images/app-screenshot.jpg"
                alt="RoleMark dashboard showing resume score of 87 with category breakdowns"
                width={1200}
                height={700}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
