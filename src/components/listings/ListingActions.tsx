'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { deleteListing, toggleListingStatus } from '@/app/(dashboard)/dashboard/actions'
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import type { ListingStatus } from '@/lib/types'

interface Props {
  id: string
  status: ListingStatus
}

export function ListingActions({ id, status }: Props) {
  return (
    <div className="flex items-center justify-end gap-1">
      <form action={toggleListingStatus}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="current_status" value={status} />
        <Button type="submit" variant="ghost" size="sm" title={status === 'active' ? 'השהה' : 'הפעל'}>
          {status === 'active' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </form>
      <Button asChild variant="ghost" size="sm" title="עריכה">
        <Link href={`/dashboard/listings/${id}/edit`}>
          <Pencil className="h-4 w-4" />
        </Link>
      </Button>
      <form
        action={deleteListing}
        // Confirm before delete (native confirm is fine for MVP).
        onSubmit={(e) => {
          if (!confirm('למחוק את המודעה?')) e.preventDefault()
        }}
      >
        <input type="hidden" name="id" value={id} />
        <Button type="submit" variant="ghost" size="sm" title="מחיקה" className="text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
