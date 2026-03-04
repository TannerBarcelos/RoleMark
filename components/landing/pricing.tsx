import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, ArrowRight } from 'lucide-react'

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
    variant: 'outline' as const,
    popular: false,
  },
  {
    name: 'One-Time',
    price: '$4.99',
    period: '/ resume',
    description: 'Pay per role. Perfect for a single application.',
    features: [
      'AI-tailored resume',
      'Full editor access',
      'PDF export',
      'Cover letter add-on ($2.99)',
      'Bundle both for $6.99',
    ],
    cta: 'Buy Once',
    variant: 'outline' as const,
    popular: false,
  },
  {
    name: 'Pro Monthly',
    price: '$12.99',
    period: '/month',
    description: 'Unlimited everything. Cancel anytime.',
    features: [
      'Unlimited resume uploads',
      'Unlimited AI scoring',
      'Unlimited tailored resumes',
      'Unlimited cover letters',
      'Inline AI editing',
      'Resume versioning',
      'Company organization',
      'Priority support',
    ],
    cta: 'Start Pro',
    variant: 'default' as const,
    popular: true,
  },
  {
    name: 'Pro Yearly',
    price: '$8.33',
    period: '/month',
    description: 'Save 36%. Billed $99.99/year.',
    features: [
      'Everything in Pro Monthly',
      'Save $56/year',
      'Best value for active job seekers',
    ],
    cta: 'Start Pro Yearly',
    variant: 'outline' as const,
    popular: false,
  },
]

export function LandingPricing() {
  return (
    <section id="pricing" className="py-16 lg:py-24 bg-card border-y border-border">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl font-bold text-foreground lg:text-4xl text-balance">
            Simple, transparent pricing
          </h2>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            {"You'll apply to more than one job. Subscribe and tailor every application."}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={
                plan.popular
                  ? 'border-primary ring-1 ring-primary relative'
                  : 'border-border'
              }
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground rounded-none">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                  {plan.period && (
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  )}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <ul className="flex flex-col gap-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  variant={plan.variant}
                  className="w-full min-h-[44px] mt-auto"
                >
                  <Link href="/auth/login">
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
