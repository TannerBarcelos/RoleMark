'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center bg-primary">
            <span className="text-xs font-bold text-primary-foreground">RM</span>
          </div>
          <span className="text-lg font-bold text-foreground">RoleMark</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link href="/auth/login">
            <CornerButton variant="ghost">Sign In</CornerButton>
          </Link>
          <Link href="/auth/login">
            <CornerButton>Get Started</CornerButton>
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
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground min-h-[44px] flex items-center"
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-3 pt-3 border-t border-border">
              <ThemeToggle />
              <Link href="/auth/login" className="w-full">
                <CornerButton variant="ghost" className="w-full justify-center">Sign In</CornerButton>
              </Link>
              <Link href="/auth/login" className="w-full">
                <CornerButton className="w-full justify-center">Get Started</CornerButton>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
