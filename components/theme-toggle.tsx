'use client'

import * as React from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex h-9 items-center gap-0.5 border border-border bg-muted/50 p-1">
        <div className="h-7 w-7" />
        <div className="h-7 w-7" />
        <div className="h-7 w-7" />
      </div>
    )
  }

  const options = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ] as const

  return (
    <div className="flex h-9 items-center gap-0.5 border border-border bg-muted/50 p-1">
      {options.map((option) => {
        const Icon = option.icon
        const isActive = theme === option.value
        
        return (
          <button
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={cn(
              'flex h-7 w-7 items-center justify-center transition-all',
              isActive
                ? 'bg-background text-primary border border-primary/50 shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
            title={option.label}
            aria-label={`Switch to ${option.label} theme`}
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        )
      })}
    </div>
  )
}
