export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  mode: 'payment' | 'subscription'
  interval?: 'month' | 'year'
  features: string[]
  popular?: boolean
}

export const PRODUCTS: Product[] = [
  {
    id: 'tailored_resume',
    name: 'Tailored Resume',
    description: 'AI-tailored resume optimized for a specific role',
    priceInCents: 499,
    mode: 'payment',
    features: [
      'AI-tailored resume for one role',
      'Full editor access to refine',
      'PDF export',
    ],
  },
  {
    id: 'cover_letter',
    name: 'Cover Letter',
    description: 'AI-generated cover letter for a specific role',
    priceInCents: 299,
    mode: 'payment',
    features: [
      'AI-generated cover letter',
      'Full editor access to refine',
      'PDF export',
    ],
  },
  {
    id: 'bundle',
    name: 'Resume + Cover Letter',
    description: 'Get both a tailored resume and cover letter',
    priceInCents: 699,
    mode: 'payment',
    features: [
      'AI-tailored resume',
      'AI-generated cover letter',
      'Full editor access',
      'PDF export for both',
    ],
  },
  {
    id: 'monthly',
    name: 'Pro Monthly',
    description: 'Unlimited access to all features',
    priceInCents: 1299,
    mode: 'subscription',
    interval: 'month',
    popular: true,
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
  },
  {
    id: 'yearly',
    name: 'Pro Yearly',
    description: 'Save 36% with annual billing',
    priceInCents: 9999,
    mode: 'subscription',
    interval: 'year',
    features: [
      'Everything in Pro Monthly',
      'Save 36% ($8.33/mo)',
      'Unlimited resume uploads',
      'Unlimited AI scoring',
      'Unlimited tailored resumes',
      'Unlimited cover letters',
      'Inline AI editing',
      'Resume versioning',
      'Company organization',
      'Priority support',
    ],
  },
]

export const FREE_UPLOAD_LIMIT = 1

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}

export function getSubscriptionProducts(): Product[] {
  return PRODUCTS.filter((p) => p.mode === 'subscription')
}

export function getOneTimeProducts(): Product[] {
  return PRODUCTS.filter((p) => p.mode === 'payment')
}
