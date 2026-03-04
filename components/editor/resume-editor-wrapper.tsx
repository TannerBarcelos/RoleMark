'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ResumeEditor } from './resume-editor'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { History, Download, Lock, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

interface Version {
  id: string
  version_number: number
  content: Record<string, unknown>
  changes_description: string
  created_at: string
}

interface ResumeEditorWrapperProps {
  resumeId: string
  initialContent: string
  hasAIAccess: boolean
  versions: Version[]
}

export function ResumeEditorWrapper({
  resumeId,
  initialContent,
  hasAIAccess,
  versions,
}: ResumeEditorWrapperProps) {
  const router = useRouter()
  const [currentContent, setCurrentContent] = useState(initialContent)

  const handleSave = async (text: string, html: string) => {
    const supabase = createClient()
    
    // Save to resume
    const { error } = await supabase
      .from('resumes')
      .update({
        edited_html: html,
        edited_text: text,
        updated_at: new Date().toISOString(),
      })
      .eq('id', resumeId)

    if (error) {
      toast.error('Failed to save changes')
      console.error(error)
      return
    }

    toast.success('Resume saved')
  }

  const handleAIAction = async (text: string, action: string): Promise<string> => {
    if (!hasAIAccess) {
      toast.error('Upgrade to Pro for AI editing features')
      return text
    }

    const response = await fetch('/api/ai/inline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, action }),
    })

    if (!response.ok) {
      const data = await response.json()
      if (data.upgradeRequired) {
        toast.error('Upgrade to Pro for AI editing features')
      } else {
        toast.error('AI enhancement failed')
      }
      return text
    }

    // Stream the response
    const reader = response.body?.getReader()
    if (!reader) return text

    let result = ''
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      result += decoder.decode(value)
    }

    return result.trim()
  }

  const loadVersion = (version: Version) => {
    // Convert version content back to HTML and reload editor
    // For simplicity, we'll just show a message for now
    toast.info(`Loading version ${version.version_number}`)
    router.refresh()
  }

  const handleExport = () => {
    // Create a simple HTML download
    const blob = new Blob([currentContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'resume.html'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Resume exported')
  }

  return (
    <div className="space-y-4">
      {/* Top Actions Bar */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/resumes/${resumeId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Resume
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          {/* Version History */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <History className="h-4 w-4 mr-2" />
                Version History
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Version History</SheetTitle>
                <SheetDescription>
                  View and restore previous versions of your resume
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {versions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No versions yet</p>
                ) : (
                  versions.map((version) => (
                    <Card
                      key={version.id}
                      className="cursor-pointer hover:border-primary/50"
                      onClick={() => loadVersion(version)}
                    >
                      <CardHeader className="p-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">
                            Version {version.version_number}
                          </CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                          </Badge>
                        </div>
                        <CardDescription className="text-xs">
                          {version.changes_description || 'No description'}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Export */}
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* AI Access Warning */}
      {!hasAIAccess && (
        <Card className="border-warning bg-warning/5">
          <CardContent className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-warning" />
              <span className="text-sm">
                AI inline editing is a Pro feature
              </span>
            </div>
            <Button size="sm" variant="outline" asChild>
              <Link href="/dashboard/billing">Upgrade</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Editor */}
      <ResumeEditor
        initialContent={currentContent}
        onSave={handleSave}
        onAIAction={hasAIAccess ? handleAIAction : undefined}
      />
    </div>
  )
}
