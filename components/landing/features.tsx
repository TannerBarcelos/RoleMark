import { GitBranch, Building2, PenTool, Sparkles, Download, Shield } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'AI Resume Scoring',
    description: 'Get a detailed breakdown across keywords, experience, skills, education, and impact.',
  },
  {
    icon: PenTool,
    title: 'Rich Text Editor',
    description: 'Full WYSIWYG editor with inline AI editing. Select any block and refine in real-time.',
  },
  {
    icon: GitBranch,
    title: 'Version Control',
    description: 'Keep every iteration of your resume. Switch between versions instantly.',
  },
  {
    icon: Building2,
    title: 'Company Boards',
    description: 'Organize resumes by company. Track every application in dedicated workspaces.',
  },
  {
    icon: Download,
    title: 'PDF Export',
    description: 'Export polished, professionally formatted PDFs ready to submit.',
  },
  {
    icon: Shield,
    title: 'Cover Letters',
    description: 'Generate tailored cover letters with the same AI-powered editing experience.',
  },
]

export function LandingFeatures() {
  return (
    <section id="features" className="py-20 lg:py-28 border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary mb-3">FEATURES</p>
          <h2 className="text-3xl font-semibold text-foreground lg:text-4xl text-balance">
            Everything you need to land the role
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Built for job seekers who apply to more than one company.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div 
              key={feature.title} 
              className="group p-6 bg-card border border-border hover:border-primary/40 transition-all duration-200"
            >
              <div className="flex h-11 w-11 items-center justify-center border border-primary/30 bg-primary/5 mb-4 group-hover:bg-primary/10 transition-colors">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
