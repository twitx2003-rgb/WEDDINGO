'use client'

import { useActionState, useState } from 'react'
import { addTenant } from '@/app/(admin)/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserPlus, Copy, Check, X } from 'lucide-react'

export function AddTenantForm() {
  const [state, action, isPending] = useActionState(addTenant, null)
  const [showForm, setShowForm] = useState(false)
  const [copied, setCopied] = useState(false)

  async function copyLink() {
    if (!state?.newToken) return
    await navigator.clipboard.writeText(`${window.location.origin}/portal/${state.newToken}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      {state?.newToken && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <p className="text-sm font-medium text-green-800 mb-2">
              ✅ {state.newName} נוסף/ה בהצלחה! שלח את הקישור הזה לדייר:
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-white border rounded px-2 py-1 truncate">
                {typeof window !== 'undefined'
                  ? `${window.location.origin}/portal/${state.newToken}`
                  : `/portal/${state.newToken}`}
              </code>
              <Button type="button" size="sm" variant="outline" onClick={copyLink}>
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!showForm ? (
        <Button onClick={() => setShowForm(true)}>
          <UserPlus className="h-4 w-4 ml-2" />
          הוסף דייר
        </Button>
      ) : (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">דייר חדש</CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowForm(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form action={action} className="space-y-4">
              {state?.error && (
                <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                  {state.error}
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="name">שם מלא *</Label>
                  <Input id="name" name="name" placeholder="ישראל ישראלי" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apartment_number">מספר דירה *</Label>
                  <Input id="apartment_number" name="apartment_number" placeholder="12" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">טלפון (אופציונלי)</Label>
                <Input id="phone" name="phone" type="tel" placeholder="050-1234567" />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'מוסיף...' : 'הוסף דייר'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  ביטול
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
