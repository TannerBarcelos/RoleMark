'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FileText, Building2, Calendar, Eye, Copy, Check } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface CoverLetter {
  id: string
  content: {
    greeting: string
    opening: string
    body: string[]
    closing: string
    signature: string
  }
  tone: string
  created_at: string
  resume: { id: string; title: string } | null
  job_description: { id: string; role_title: string; company_name: string } | null
}

interface CoverLettersListProps {
  coverLetters: CoverLetter[]
}

export function CoverLettersList({ coverLetters }: CoverLettersListProps) {
  const [selectedLetter, setSelectedLetter] = useState<CoverLetter | null>(null)
  const [copied, setCopied] = useState(false)

  const formatCoverLetter = (content: CoverLetter['content']) => {
    return `${content.greeting}

${content.opening}

${content.body.join('\n\n')}

${content.closing}

${content.signature}`
  }

  const handleCopy = async () => {
    if (selectedLetter) {
      await navigator.clipboard.writeText(formatCoverLetter(selectedLetter.content))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (coverLetters.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">No cover letters yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Generate a cover letter when viewing a scored resume
          </p>
          <Button asChild>
            <Link href="/dashboard/resumes">View Resumes</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {coverLetters.map((letter) => (
          <Card
            key={letter.id}
            className="cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => setSelectedLetter(letter)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base line-clamp-1">
                  {letter.job_description?.role_title || 'Cover Letter'}
                </CardTitle>
                <Badge variant="secondary" className="text-xs capitalize">
                  {letter.tone}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {letter.job_description?.company_name || 'Company'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {letter.content.opening}
              </p>
              <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDistanceToNow(new Date(letter.created_at), { addSuffix: true })}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto h-7 text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedLetter(letter)
                  }}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedLetter} onOpenChange={() => setSelectedLetter(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedLetter?.job_description?.role_title || 'Cover Letter'}
            </DialogTitle>
            <DialogDescription>
              {selectedLetter?.job_description?.company_name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedLetter && (
            <div className="space-y-4">
              <div className="prose prose-sm max-w-none">
                <p>{selectedLetter.content.greeting}</p>
                <p>{selectedLetter.content.opening}</p>
                {selectedLetter.content.body.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
                <p>{selectedLetter.content.closing}</p>
                <p>{selectedLetter.content.signature}</p>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={handleCopy}>
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy to Clipboard
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
