'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Upload, FileText, Link as LinkIcon, Loader2, AlertCircle } from 'lucide-react'
import type { UserAccess } from '@/lib/paywall'

interface ResumeUploadFlowProps {
  userId: string
  access: UserAccess
  companies: Array<{ id: string; name: string }>
}

export function ResumeUploadFlow({ userId, access, companies }: ResumeUploadFlowProps) {
  const router = useRouter()
  const [step, setStep] = useState<'upload' | 'jd' | 'scoring'>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [resumeTitle, setResumeTitle] = useState('')
  const [companyId, setCompanyId] = useState<string>('')
  const [jdSource, setJdSource] = useState<'text' | 'url'>('text')
  const [jdText, setJdText] = useState('')
  const [jdUrl, setJdUrl] = useState('')
  const [jdTitle, setJdTitle] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [isScoring, setIsScoring] = useState(false)
  const [isFetchingJd, setIsFetchingJd] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const canUpload = access.canUpload

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile?.type === 'application/pdf') {
      setFile(droppedFile)
      if (!resumeTitle) setResumeTitle(droppedFile.name.replace('.pdf', ''))
    } else {
      toast.error('Please upload a PDF file')
    }
  }, [resumeTitle])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile?.type === 'application/pdf') {
      setFile(selectedFile)
      if (!resumeTitle) setResumeTitle(selectedFile.name.replace('.pdf', ''))
    } else {
      toast.error('Please upload a PDF file')
    }
  }

  const handleUploadAndContinue = async () => {
    if (!file || !resumeTitle.trim()) {
      toast.error('Please upload a file and provide a title')
      return
    }

    setIsUploading(true)
    try {
      const supabase = createClient()

      // Upload file to Supabase Storage
      const filePath = `${userId}/${Date.now()}_${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Create resume record
      const { data: resume, error: resumeError } = await supabase
        .from('resumes')
        .insert({
          user_id: userId,
          title: resumeTitle.trim(),
          original_file_url: filePath,
          company_id: companyId || null,
          status: 'uploaded',
        })
        .select('id')
        .single()

      if (resumeError) throw resumeError

      // Increment free_uploads_used
      if (access.level === 'free') {
        await supabase.rpc('increment_free_uploads', { user_id_input: userId })
          .then(({ error }) => {
            // If RPC doesn't exist yet, do it manually
            if (error) {
              return supabase
                .from('profiles')
                .update({ free_uploads_used: access.freeUploadsUsed + 1 })
                .eq('id', userId)
            }
          })
      }

      // Store resume ID for next step
      sessionStorage.setItem('new_resume_id', resume.id)
      setStep('jd')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFetchJd = async () => {
    if (!jdUrl.trim()) {
      toast.error('Please enter a URL')
      return
    }

    setIsFetchingJd(true)
    try {
      const res = await fetch('/api/ai/fetch-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: jdUrl.trim() }),
      })

      if (!res.ok) throw new Error('Failed to fetch job description')

      const data = await res.json()
      setJdText(data.text)
      if (data.title) setJdTitle(data.title)
      setJdSource('text')
      toast.success('Job description fetched successfully')
    } catch {
      toast.error('Could not extract job description from that URL. Try pasting the text instead.')
    } finally {
      setIsFetchingJd(false)
    }
  }

  const handleScore = async () => {
    const resumeId = sessionStorage.getItem('new_resume_id')
    if (!resumeId || !jdText.trim()) {
      toast.error('Please provide a job description')
      return
    }

    setIsScoring(true)
    try {
      const supabase = createClient()

      // Save job description
      const { data: jd, error: jdError } = await supabase
        .from('job_descriptions')
        .insert({
          resume_id: resumeId,
          user_id: userId,
          source_type: jdSource === 'url' && jdUrl ? 'url' : 'text',
          source_url: jdUrl || null,
          title: jdTitle.trim() || null,
          company_name: null,
          raw_text: jdText.trim(),
        })
        .select('id')
        .single()

      if (jdError) throw jdError

      setStep('scoring')

      // Call scoring API
      const res = await fetch('/api/ai/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId, jobDescriptionId: jd.id }),
      })

      if (!res.ok) throw new Error('Scoring failed')

      // Update resume status
      await supabase
        .from('resumes')
        .update({ status: 'scored' })
        .eq('id', resumeId)

      sessionStorage.removeItem('new_resume_id')
      router.push(`/dashboard/resumes/${resumeId}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Scoring failed')
      setStep('jd')
    } finally {
      setIsScoring(false)
    }
  }

  if (!canUpload && step === 'upload') {
    return (
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">New Resume</h1>
          <p className="text-muted-foreground">Upload and score your resume against a role</p>
        </div>
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <div>
              <p className="font-semibold text-foreground">Free upload limit reached</p>
              <p className="text-sm text-muted-foreground mt-1">
                {"You've used your free resume upload. Upgrade to Pro for unlimited uploads and AI features."}
              </p>
            </div>
            <Button onClick={() => router.push('/dashboard/billing')} className="min-h-[44px]">
              View Plans
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">New Resume</h1>
        <p className="text-muted-foreground">Upload and score your resume against a role</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {['Upload', 'Job Description', 'Score'].map((label, i) => {
          const stepIndex = ['upload', 'jd', 'scoring'].indexOf(step)
          const isCompleted = i < stepIndex
          const isCurrent = i === stepIndex
          return (
            <div key={label} className="flex items-center gap-2">
              {i > 0 && <div className={`h-px w-8 ${isCompleted || isCurrent ? 'bg-primary' : 'bg-border'}`} />}
              <div className="flex items-center gap-1.5">
                <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
                  isCurrent ? 'bg-primary text-primary-foreground' :
                  isCompleted ? 'bg-primary/20 text-primary' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {i + 1}
                </div>
                <span className={`text-sm hidden sm:inline ${isCurrent ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                  {label}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Step 1: Upload */}
      {step === 'upload' && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Your Resume</CardTitle>
            <CardDescription>Upload a PDF resume to get started</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {/* Drag and drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={`flex flex-col items-center gap-3 rounded-lg border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${
                dragActive ? 'border-primary bg-primary/5' : file ? 'border-primary/40 bg-primary/5' : 'border-border hover:border-primary/40'
              }`}
              onClick={() => document.getElementById('file-input')?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') document.getElementById('file-input')?.click() }}
            >
              {file ? (
                <>
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <Button variant="ghost" size="sm" className="min-h-[44px]" onClick={(e) => { e.stopPropagation(); setFile(null) }}>
                    Change file
                  </Button>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Drop your resume here</p>
                    <p className="text-sm text-muted-foreground">or click to browse (PDF only)</p>
                  </div>
                </>
              )}
              <input
                id="file-input"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Resume Title</Label>
              <Input
                id="title"
                placeholder="e.g. Senior Frontend Engineer - Acme Corp"
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
                className="min-h-[44px]"
              />
            </div>

            {companies.length > 0 && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="company">Company (optional)</Label>
                <select
                  id="company"
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">No company</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}

            <Button
              onClick={handleUploadAndContinue}
              disabled={!file || !resumeTitle.trim() || isUploading}
              className="min-h-[44px]"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Job Description */}
      {step === 'jd' && (
        <Card>
          <CardHeader>
            <CardTitle>Add Job Description</CardTitle>
            <CardDescription>Paste the job description or provide a link to the posting</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Tabs defaultValue="text" onValueChange={(v) => setJdSource(v as 'text' | 'url')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text" className="min-h-[44px]">Paste Text</TabsTrigger>
                <TabsTrigger value="url" className="min-h-[44px]">From URL</TabsTrigger>
              </TabsList>
              <TabsContent value="text" className="flex flex-col gap-3 mt-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="jd-title">Job Title (optional)</Label>
                  <Input
                    id="jd-title"
                    placeholder="e.g. Senior Frontend Engineer"
                    value={jdTitle}
                    onChange={(e) => setJdTitle(e.target.value)}
                    className="min-h-[44px]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="jd-text">Job Description</Label>
                  <Textarea
                    id="jd-text"
                    placeholder="Paste the full job description here..."
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    rows={12}
                    className="min-h-[200px] resize-y"
                  />
                </div>
              </TabsContent>
              <TabsContent value="url" className="flex flex-col gap-3 mt-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="jd-url">Job Posting URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="jd-url"
                      placeholder="https://jobs.example.com/posting/12345"
                      value={jdUrl}
                      onChange={(e) => setJdUrl(e.target.value)}
                      className="min-h-[44px]"
                    />
                    <Button
                      variant="outline"
                      onClick={handleFetchJd}
                      disabled={!jdUrl.trim() || isFetchingJd}
                      className="min-h-[44px] shrink-0"
                    >
                      {isFetchingJd ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <LinkIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {"We'll fetch and extract the job description text automatically"}
                  </p>
                </div>
                {jdText && (
                  <div className="flex flex-col gap-2">
                    <Label>Extracted Text</Label>
                    <Textarea
                      value={jdText}
                      onChange={(e) => setJdText(e.target.value)}
                      rows={10}
                      className="min-h-[200px] resize-y"
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <Button
              onClick={handleScore}
              disabled={!jdText.trim() || isScoring}
              className="min-h-[44px]"
            >
              {isScoring ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scoring Resume...
                </>
              ) : (
                'Score My Resume'
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Scoring in progress */}
      {step === 'scoring' && (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-12 text-center">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-lg">Analyzing your resume...</p>
              <p className="text-sm text-muted-foreground mt-1">
                Our AI is comparing your resume against the job description
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
