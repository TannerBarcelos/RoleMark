'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    question: 'How does the AI scoring work?',
    answer:
      'Our AI analyzes your resume against the job description, evaluating keyword matches, skills alignment, experience relevance, and ATS compatibility. You get a score from 0-100 with specific suggestions for improvement.',
  },
  {
    question: 'Will the tailored resume still sound like me?',
    answer:
      'Yes. Our AI enhances and optimizes your existing content rather than replacing it. It restructures, emphasizes relevant experience, and adds missing keywords while maintaining your authentic voice and accomplishments.',
  },
  {
    question: 'What file formats do you support?',
    answer:
      'We support PDF, DOCX, and DOC files for upload. You can export your tailored resumes as PDF or DOCX.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Absolutely. We use enterprise-grade encryption, never share your data with third parties, and you can delete your account and all associated data at any time.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer:
      "Yes, you can cancel your Pro subscription at any time. You'll continue to have access until the end of your billing period.",
  },
  {
    question: 'What if I need help?',
    answer:
      'Pro subscribers get priority support via email. Free users can access our help documentation and community resources.',
  },
]

export function LandingFAQ() {
  return (
    <section id="faq" className="py-20 lg:py-28 border-t border-border">
      <div className="mx-auto max-w-3xl px-4 lg:px-6">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-primary mb-3">FAQ</p>
          <h2 className="text-3xl font-semibold text-foreground lg:text-4xl text-balance">
            Common questions
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-border">
              <AccordionTrigger className="text-left text-foreground hover:text-primary hover:no-underline py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
