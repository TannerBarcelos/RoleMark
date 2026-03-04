import { Upload, BarChart3, Wand2 } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: Upload,
    title: 'Upload Your Resume',
    description:
      'Drop your PDF resume and paste the job description or provide a URL. We handle the rest.',
  },
  {
    step: '02',
    icon: BarChart3,
    title: 'Get Your Score',
    description:
      'Our AI analyzes keyword match, experience relevance, skills alignment, and more. See exactly where you stand.',
  },
  {
    step: '03',
    icon: Wand2,
    title: 'Tailor & Refine',
    description:
      'Generate an AI-tailored resume and cover letter. Edit with our rich text editor and inline AI suggestions.',
  },
]

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary mb-3">HOW IT WORKS</p>
          <h2 className="text-3xl font-semibold text-foreground lg:text-4xl text-balance">
            Three steps to your best resume
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            From upload to offer-ready in minutes, not hours.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          {steps.map((item, index) => (
            <div key={item.step} className="relative flex flex-col items-start gap-4">
              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-border" />
              )}
              
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center border border-primary/30 bg-primary/5">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center bg-primary text-[10px] font-medium text-primary-foreground">
                  {index + 1}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
