'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface CornerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  children: React.ReactNode
  variant?: 'default' | 'ghost'
}

export function CornerButton({
  className,
  children,
  variant = 'default',
  asChild,
  ...props
}: CornerButtonProps) {
  const Comp = asChild ? 'span' : 'button'
  
  return (
    <Comp
      className={cn(
        'group relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium transition-all min-h-[44px]',
        variant === 'default' && 'bg-transparent text-primary border border-primary hover:bg-primary/5',
        variant === 'ghost' && 'bg-transparent text-foreground hover:text-primary',
        className
      )}
      {...props}
    >
      {/* Corner flares - only show on default variant */}
      {variant === 'default' && (
        <>
          {/* Top-left corner */}
          <span className="absolute -top-px -left-px w-2.5 h-2.5 border-t-2 border-l-2 border-primary" />
          {/* Top-right corner */}
          <span className="absolute -top-px -right-px w-2.5 h-2.5 border-t-2 border-r-2 border-primary" />
          {/* Bottom-left corner */}
          <span className="absolute -bottom-px -left-px w-2.5 h-2.5 border-b-2 border-l-2 border-primary" />
          {/* Bottom-right corner */}
          <span className="absolute -bottom-px -right-px w-2.5 h-2.5 border-b-2 border-r-2 border-primary" />
        </>
      )}
      {children}
    </Comp>
  )
}

// Wrapper for Next.js Link compatibility
interface CornerButtonLinkProps {
  href: string
  children: React.ReactNode
  variant?: 'default' | 'ghost'
  className?: string
}

export function CornerButtonLink({ href, children, variant = 'default', className }: CornerButtonLinkProps) {
  return (
    <a href={href} className="inline-flex">
      <CornerButton variant={variant} className={className} asChild>
        {children}
      </CornerButton>
    </a>
  )
}
