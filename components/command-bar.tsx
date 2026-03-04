'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  FileText,
  Building2,
  Plus,
  Search,
  Settings,
  CreditCard,
  LayoutDashboard,
  PenLine,
  Home,
} from 'lucide-react'

interface CommandBarProps {
  resumes?: Array<{ id: string; title: string; company?: string }>
  companies?: Array<{ id: string; name: string }>
}

export function CommandBar({ resumes = [], companies = [] }: CommandBarProps) {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search resumes, companies, or navigate..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/resumes/new'))}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Upload New Resume</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/cover-letters'))}>
            <PenLine className="mr-2 h-4 w-4" />
            <span>Create Cover Letter</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => router.push('/'))}>
            <Home className="mr-2 h-4 w-4" />
            <span>Home</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/dashboard'))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/resumes'))}>
            <FileText className="mr-2 h-4 w-4" />
            <span>All Resumes</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/companies'))}>
            <Building2 className="mr-2 h-4 w-4" />
            <span>Companies</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/billing'))}>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/settings'))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>

        {resumes.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Recent Resumes">
              {resumes.slice(0, 5).map((resume) => (
                <CommandItem
                  key={resume.id}
                  onSelect={() => runCommand(() => router.push(`/dashboard/resumes/${resume.id}`))}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <span>{resume.title}</span>
                  {resume.company && (
                    <span className="ml-auto text-xs text-muted-foreground">{resume.company}</span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {companies.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Companies">
              {companies.slice(0, 5).map((company) => (
                <CommandItem
                  key={company.id}
                  onSelect={() => runCommand(() => router.push(`/dashboard/companies/${company.id}`))}
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  <span>{company.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}

// Trigger button for the command bar
export function CommandBarTrigger() {
  return (
    <button
      onClick={() => {
        const event = new KeyboardEvent('keydown', {
          key: 'k',
          metaKey: true,
          bubbles: true,
        })
        document.dispatchEvent(event)
      }}
      className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
    >
      <Search className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">Search...</span>
      <kbd className="hidden sm:inline-flex h-5 items-center gap-1 border border-border bg-background px-1.5 font-mono text-[10px] font-medium">
        <span className="text-xs">⌘</span>K
      </kbd>
    </button>
  )
}
