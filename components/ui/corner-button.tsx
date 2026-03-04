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
      {/* Corner flares with cross marks - only show on default variant */}
      {variant === 'default' && (
        <>
          {/* Top-left corner cross */}
          <span className="absolute -top-1 left-0 w-px h-2 bg-primary" />
          <span className="absolute top-0 -left-1 w-2 h-px bg-primary" />
          {/* Top-right corner cross */}
          <span className="absolute -top-1 right-0 w-px h-2 bg-primary" />
          <span className="absolute top-0 -right-1 w-2 h-px bg-primary" />
          {/* Bottom-left corner cross */}
          <span className="absolute -bottom-1 left-0 w-px h-2 bg-primary" />
          <span className="absolute bottom-0 -left-1 w-2 h-px bg-primary" />
          {/* Bottom-right corner cross */}
          <span className="absolute -bottom-1 right-0 w-px h-2 bg-primary" />
          <span className="absolute bottom-0 -right-1 w-2 h-px bg-primary" />
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
