import * as React from 'react'
import { cn } from '@/lib/utils'

interface CornerButtonProps {
  children: React.ReactNode
  variant?: 'default' | 'ghost'
  className?: string
}

export function CornerButton({
  className,
  children,
  variant = 'default',
}: CornerButtonProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium transition-all min-h-[44px] cursor-pointer',
        variant === 'default' && 'bg-transparent text-primary border-2 border-primary hover:border-primary/70 hover:text-primary/70',
        variant === 'ghost' && 'bg-transparent text-foreground hover:text-primary',
        className
      )}
    >
      {children}
    </span>
  )
}
