'use client'

import { useActionState } from 'react'
import { register } from '@/app/(auth)/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export function RegisterForm() {
  const [state, action, isPending] = useActionState(register, null)

  return (
    <form action={action} className="space-y-4">
      {state?.error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="name">שם מלא</Label>
        <Input id="name" name="name" placeholder="ישראל ישראלי" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">אימייל</Label>
        <Input id="email" name="email" type="email" placeholder="vaad@example.com" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">סיסמה</Label>
        <Input id="password" name="password" type="password" minLength={6} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">כתובת הבניין</Label>
        <Input id="address" name="address" placeholder="רחוב הרצל 12, תל אביב" required />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <Label htmlFor="apartments">מספר דירות</Label>
          <Input id="apartments" name="apartments" type="number" placeholder="20" min={1} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fee">דמי ועד (₪/חודש)</Label>
          <Input id="fee" name="fee" type="number" placeholder="200" min={1} required />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'נרשם...' : 'הרשמה'}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        יש לך חשבון?{' '}
        <Link href="/login" className="underline">
          כניסה
        </Link>
      </p>
    </form>
  )
}
