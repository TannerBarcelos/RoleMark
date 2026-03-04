import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CornerButton } from '@/components/ui/corner-button'

export function LandingCTA() {
  return (
    <section className="py-20 lg:py-28 border-t border-border bg-muted/30">
      <div className="mx-auto max-w-3xl px-4 lg:px-6 text-center">
        <h2 className="text-3xl font-semibold text-foreground lg:text-4xl text-balance">
          Ready to land your next role?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
          Join thousands of job seekers who have improved their interview rates with AI-tailored resumes.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/auth/login">
            <CornerButton className="min-h-[52px] px-8 text-base gap-2">
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </CornerButton>
          </Link>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          No credit card required. Score your first resume in 30 seconds.
        </p>
      </div>
    </section>
  )
}
