'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MessageCircle, Phone } from 'lucide-react'

// Normalize an Israeli phone number to international format for wa.me.
// e.g. "050-1234567" -> "972501234567"
function toWhatsappNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('0')) return '972' + digits.slice(1)
  if (digits.startsWith('972')) return digits
  return digits
}

export function ContactReveal({ phone, name }: { phone: string | null; name: string }) {
  const [revealed, setRevealed] = useState(false)

  if (!phone) {
    return (
      <p className="text-sm text-muted-foreground">
        בעל/ת התחביב לא השאיר/ה פרטי קשר.
      </p>
    )
  }

  if (!revealed) {
    return (
      <Button onClick={() => setRevealed(true)} className="w-full">
        <MessageCircle className="h-4 w-4 ml-2" />
        הצג פרטי קשר
      </Button>
    )
  }

  const wa = toWhatsappNumber(phone)
  const waText = encodeURIComponent(`היי ${name}, ראיתי את המודעה שלך ואשמח לפרטים`)

  return (
    <div className="space-y-2">
      <Button asChild className="w-full bg-green-600 hover:bg-green-700">
        <a href={`https://wa.me/${wa}?text=${waText}`} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="h-4 w-4 ml-2" />
          שליחת הודעה בוואטסאפ
        </a>
      </Button>
      <Button asChild variant="outline" className="w-full">
        <a href={`tel:${phone}`}>
          <Phone className="h-4 w-4 ml-2" />
          {phone}
        </a>
      </Button>
    </div>
  )
}
