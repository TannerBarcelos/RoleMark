import { Card, CardContent } from '@/components/ui/card'
import { GitBranch, Building2, PenTool, Sparkles, Download, Shield } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'AI Resume Scoring',
    description: 'Get a detailed breakdown across keywords, experience, skills, education, and impact. Know exactly where to improve.',
  },
  {
    icon: PenTool,
    title: 'Rich Text Editor',
    description: 'Full WYSIWYG editor with inline AI editing. Select any block, ask AI to improve it, and watch it refine in real-time.',
  },
  {
    icon: GitBranch,
    title: 'Version Control',
    description: 'Keep every iteration of your resume. Switch between original, AI-tailored, and manually refined versions instantly.',
  },
  {
    icon: Building2,
    title: 'Company Boards',
    description: 'Organize resumes by company. Track every application with a dedicated workspace for each role you pursue.',
  },
  {
    icon: Download,
    title: 'PDF Export',
    description: 'Export polished, professionally formatted PDFs ready to submit. Control fonts, spacing, and margins down to the pixel.',
  },
  {
    icon: Shield,
    title: 'Cover Letters',
    description: 'Generate tailored cover letters that complement your resume. Customizable with the same rich editor and AI assistance.',
  },
]

export function LandingFeatures() {
  return (
    <section id="features" className="py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl font-bold text-foreground lg:text-4xl text-balance">
            Everything you need to land the role
          </h2>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Built for job seekers who apply to more than one company.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="border-border/60 hover:border-primary/30 transition-colors">
              <CardContent className="flex flex-col gap-3 p-6">
                <div className="flex h-10 w-10 items-center justify-center bg-primary/10 border border-primary/20">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
