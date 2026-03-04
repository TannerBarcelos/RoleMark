import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'
import { CornerButton } from '@/components/ui/corner-button'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '',
    description: 'Try it out with one resume',
    features: [
      '1 resume upload',
      'AI scoring & analysis',
      'Weakness breakdown',
      'Improvement suggestions',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'One-Time',
    price: '$4.99',
    period: '/ resume',
    description: 'Pay per role',
    features: [
      'AI-tailored resume',
      'Full editor access',
      'PDF export',
      'Cover letter add-on ($2.99)',
    ],
    cta: 'Buy Once',
    popular: false,
  },
  {
    name: 'Pro Monthly',
    price: '$12.99',
    period: '/mo',
    description: 'Unlimited everything',
    features: [
      'Unlimited uploads',
      'Unlimited AI scoring',
      'Unlimited tailored resumes',
      'Unlimited cover letters',
      'Inline AI editing',
      'Version control',
      'Company boards',
      'Priority support',
    ],
    cta: 'Start Pro',
    popular: true,
  },
  {
    name: 'Pro Yearly',
    price: '$8.33',
    period: '/mo',
    description: 'Billed $99.99/year',
    features: [
      'Everything in Monthly',
      'Save $56/year',
      'Best for active seekers',
    ],
    cta: 'Start Yearly',
    popular: false,
  },
]

export function LandingPricing() {
  return (
    <section id="pricing" className="py-20 lg:py-28 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary mb-3">PRICING</p>
          <h2 className="text-3xl font-semibold text-foreground lg:text-4xl text-balance">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {"You'll apply to more than one job. Subscribe and tailor every application."}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col p-6 bg-card border ${
                plan.popular
                  ? 'border-primary ring-1 ring-primary relative'
                  : 'border-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  POPULAR
                </div>
              )}
              
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-semibold text-foreground">{plan.price}</span>
                  {plan.period && (
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              </div>
              
              <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link href="/auth/login">
                <CornerButton className="w-full min-h-[44px] justify-center gap-2">
                  {plan.cta}
                  <ArrowRight className="h-4 w-4" />
                </CornerButton>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
