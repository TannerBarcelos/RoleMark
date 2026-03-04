import { LandingHero } from '@/components/landing/hero'
import { LandingHowItWorks } from '@/components/landing/how-it-works'
import { LandingPricing } from '@/components/landing/pricing'
import { LandingFeatures } from '@/components/landing/features'
import { LandingFAQ } from '@/components/landing/faq'
import { LandingCTA } from '@/components/landing/cta'
import { LandingFooter } from '@/components/landing/footer'
import { LandingNav } from '@/components/landing/nav'

export default function HomePage() {
  return (
    <div className="min-h-svh bg-background">
      <LandingNav />
      <main>
        <LandingHero />
        <LandingHowItWorks />
        <LandingFeatures />
        <LandingPricing />
        <LandingFAQ />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  )
}
