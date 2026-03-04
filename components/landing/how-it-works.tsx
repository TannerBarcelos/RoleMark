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
    <section id="how-it-works" className="py-16 lg:py-24 bg-card border-y border-border">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl font-bold text-foreground lg:text-4xl text-balance">
            Three steps to your best resume
          </h2>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            From upload to offer-ready in minutes, not hours.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((item) => (
            <div key={item.step} className="flex flex-col items-center text-center gap-4">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center bg-primary/10 border border-primary/20">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center bg-primary text-xs font-bold text-primary-foreground">
                  {item.step}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed max-w-xs">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
