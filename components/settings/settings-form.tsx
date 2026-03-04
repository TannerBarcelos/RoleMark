'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { User, Mail, Shield, Trash2, Loader2, Github, Chrome } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface SettingsFormProps {
  user: {
    id: string
    email: string
    provider: string
  }
  profile: {
    id: string
    full_name: string | null
    avatar_url: string | null
    subscription_tier: string
  } | null
}

export function SettingsForm({ user, profile }: SettingsFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fullName, setFullName] = useState(profile?.full_name || '')

  const handleUpdateProfile = async () => {
    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName.trim() || null })
      .eq('id', user.id)

    if (error) {
      toast.error('Failed to update profile')
      console.error(error)
    } else {
      toast.success('Profile updated')
      router.refresh()
    }

    setLoading(false)
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleDeleteAccount = async () => {
    // Note: In production, you'd want a server action for this
    // that properly deletes user data before auth record
    toast.error('Account deletion requires contacting support')
  }

  const providerIcon = {
    google: <Chrome className="h-4 w-4" />,
    github: <Github className="h-4 w-4" />,
    linkedin_oidc: <User className="h-4 w-4" />,
  }

  return (
    <div className="space-y-6">
      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile
          </CardTitle>
          <CardDescription>
            Your personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          <Button onClick={handleUpdateProfile} disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Account */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Account
          </CardTitle>
          <CardDescription>
            Your account details and authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <div className="flex items-center gap-2">
              <Input value={user.email} disabled />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Sign-in Method</Label>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1 capitalize">
                {providerIcon[user.provider as keyof typeof providerIcon] || <Shield className="h-4 w-4" />}
                {user.provider === 'linkedin_oidc' ? 'LinkedIn' : user.provider}
              </Badge>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Subscription</Label>
            <div className="flex items-center gap-2">
              <Badge variant={profile?.subscription_tier === 'free' ? 'secondary' : 'default'}>
                {profile?.subscription_tier === 'pro_yearly'
                  ? 'Pro (Yearly)'
                  : profile?.subscription_tier === 'pro_monthly'
                  ? 'Pro (Monthly)'
                  : 'Free'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sign Out */}
      <Card>
        <CardHeader>
          <CardTitle>Session</CardTitle>
          <CardDescription>
            Manage your current session
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions that affect your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  account and remove all your data including resumes, cover letters,
                  and application history.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}
