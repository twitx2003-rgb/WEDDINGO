'use client'

import { useActionState, useState } from 'react'
import { register } from '@/app/(auth)/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Store, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

type Role = 'customer' | 'hobbyist'

export function RegisterForm() {
  const [state, action, isPending] = useActionState(register, null)
  const [role, setRole] = useState<Role>('hobbyist')

  return (
    <form action={action} className="space-y-4">
      {state?.error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <input type="hidden" name="role" value={role} />
      <div className="space-y-2">
        <Label>אני נרשם/ת בתור</Label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setRole('hobbyist')}
            className={cn(
              'flex flex-col items-center gap-1 rounded-md border-2 p-3 text-sm transition-colors',
              role === 'hobbyist'
                ? 'border-primary bg-primary/5 font-medium'
                : 'border-input hover:bg-accent'
            )}
          >
            <Store className="h-5 w-5" />
            בעל/ת תחביב
            <span className="text-xs text-muted-foreground">מציע/ה שירות</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={cn(
              'flex flex-col items-center gap-1 rounded-md border-2 p-3 text-sm transition-colors',
              role === 'customer'
                ? 'border-primary bg-primary/5 font-medium'
                : 'border-input hover:bg-accent'
            )}
          >
            <ShoppingBag className="h-5 w-5" />
            לקוח/ה
            <span className="text-xs text-muted-foreground">מחפש/ת שירות</span>
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">שם מלא</Label>
        <Input id="name" name="name" placeholder="ישראל ישראלי" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">אימייל</Label>
        <Input id="email" name="email" type="email" placeholder="you@example.com" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">סיסמה</Label>
        <Input id="password" name="password" type="password" minLength={6} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">
          טלפון {role === 'hobbyist' ? '(לקבלת פניות בוואטסאפ)' : '(אופציונלי)'}
        </Label>
        <Input id="phone" name="phone" type="tel" placeholder="050-1234567" />
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
