'use client'

import { useActionState } from 'react'
import { updateProfile } from '@/app/(dashboard)/dashboard/profile/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Profile } from '@/lib/types'

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, action, isPending] = useActionState(updateProfile, null)

  return (
    <form action={action} className="space-y-4">
      {state?.error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          הפרופיל עודכן בהצלחה
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">שם מלא</Label>
        <Input id="name" name="name" defaultValue={profile.name} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">טלפון (לקבלת פניות בוואטסאפ)</Label>
        <Input id="phone" name="phone" type="tel" defaultValue={profile.phone ?? ''} placeholder="050-1234567" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">אזור / מיקום</Label>
        <Input id="location" name="location" defaultValue={profile.location ?? ''} placeholder="תל אביב והמרכז" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">קצת עליי</Label>
        <Textarea id="bio" name="bio" rows={4} defaultValue={profile.bio ?? ''} placeholder="ספר/י על עצמך ועל התחביב שלך" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="avatar_url">קישור לתמונת פרופיל (אופציונלי)</Label>
        <Input id="avatar_url" name="avatar_url" type="url" defaultValue={profile.avatar_url ?? ''} placeholder="https://..." />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? 'שומר...' : 'שמירה'}
      </Button>
    </form>
  )
}
