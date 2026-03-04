import Link from 'next/link'

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-background py-8 lg:py-12">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center bg-primary">
              <span className="text-[10px] font-bold text-primary-foreground tracking-tight">RM</span>
            </div>
            <span className="text-lg font-semibold text-foreground tracking-tight">RoleMark</span>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <a href="mailto:support@rolemark.ai" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Support
            </a>
          </nav>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">
            {'RoleMark. Every role deserves the right resume.'}
          </p>
        </div>
      </div>
    </footer>
  )
}
