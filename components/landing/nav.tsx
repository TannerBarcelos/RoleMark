'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { CornerButton } from '@/components/ui/corner-button'

const navLinks = [
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
]

export function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center bg-primary">
            <span className="text-[10px] font-bold text-primary-foreground tracking-tight">RM</span>
          </div>
          <span className="text-lg font-semibold text-foreground tracking-tight">RoleMark</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Sign In
          </Link>
          <Link href="/auth/login">
            <CornerButton className="px-5 py-2">Get Started</CornerButton>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-11 w-11 items-center justify-center md:hidden"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-border bg-background p-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors min-h-[44px] flex items-center"
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-3 pt-4 mt-2 border-t border-border">
              <div className="px-3">
                <ThemeToggle />
              </div>
              <Link 
                href="/auth/login" 
                className="px-3 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors min-h-[44px] flex items-center"
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>
              <Link href="/auth/login" className="w-full" onClick={() => setMobileOpen(false)}>
                <CornerButton className="w-full justify-center">Get Started</CornerButton>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
