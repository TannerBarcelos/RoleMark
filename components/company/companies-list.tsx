'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Building2, Plus, FileText, Calendar, ExternalLink, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'

interface Company {
  id: string
  name: string
  website: string | null
  notes: string | null
  status: string
  created_at: string
  resumes: { count: number }[]
}

interface CompaniesListProps {
  companies: Company[]
}

export function CompaniesList({ companies: initialCompanies }: CompaniesListProps) {
  const router = useRouter()
  const [companies, setCompanies] = useState(initialCompanies)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    notes: '',
  })

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast.error('Company name is required')
      return
    }

    setLoading(true)
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('Not authenticated')
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('companies')
      .insert({
        user_id: user.id,
        name: formData.name.trim(),
        website: formData.website.trim() || null,
        notes: formData.notes.trim() || null,
      })
      .select()
      .single()

    if (error) {
      toast.error('Failed to create company')
      console.error(error)
    } else {
      toast.success('Company created')
      setCompanies([{ ...data, resumes: [{ count: 0 }] }, ...companies])
      setDialogOpen(false)
      setFormData({ name: '', website: '', notes: '' })
    }

    setLoading(false)
  }

  const statusColors: Record<string, string> = {
    researching: 'bg-muted text-muted-foreground',
    applying: 'bg-primary/10 text-primary',
    interviewing: 'bg-warning/10 text-warning',
    offer: 'bg-success/10 text-success',
    rejected: 'bg-destructive/10 text-destructive',
  }

  return (
    <div className="space-y-6">
      {/* Add Company Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Company
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Company</DialogTitle>
            <DialogDescription>
              Create a new company to organize your job applications
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Google"
                value={formData.name}
                onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                placeholder="https://example.com"
                value={formData.website}
                onChange={(e) => setFormData(f => ({ ...f, website: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                placeholder="Any notes about the company"
                value={formData.notes}
                onChange={(e) => setFormData(f => ({ ...f, notes: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Companies Grid */}
      {companies.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No companies yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add companies to organize your job applications
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <Card
              key={company.id}
              className="hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => router.push(`/dashboard/companies/${company.id}`)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {company.name}
                  </CardTitle>
                  <Badge
                    variant="secondary"
                    className={statusColors[company.status] || statusColors.researching}
                  >
                    {company.status}
                  </Badge>
                </div>
                {company.website && (
                  <CardDescription className="flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {new URL(company.website).hostname}
                    </a>
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {company.notes && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {company.notes}
                  </p>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <FileText className="h-3 w-3" />
                    {company.resumes[0]?.count || 0} resumes
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDistanceToNow(new Date(company.created_at), { addSuffix: true })}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
