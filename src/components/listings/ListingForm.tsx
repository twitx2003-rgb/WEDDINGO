'use client'

import { useActionState } from 'react'
import { createListing, updateListing } from '@/app/(dashboard)/dashboard/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import Link from 'next/link'
import { PRICE_UNIT_LABELS, type Category, type Listing, type PriceUnit } from '@/lib/types'

interface Props {
  categories: Category[]
  listing?: Listing
}

const PRICE_UNITS = Object.keys(PRICE_UNIT_LABELS) as PriceUnit[]

export function ListingForm({ categories, listing }: Props) {
  const action = listing ? updateListing : createListing
  const [state, formAction, isPending] = useActionState(action, null)

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}
      {listing && <input type="hidden" name="id" value={listing.id} />}

      <div className="space-y-2">
        <Label htmlFor="title">כותרת המודעה</Label>
        <Input
          id="title"
          name="title"
          defaultValue={listing?.title}
          placeholder="לדוגמה: צילומי אירועים מקצועיים"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category_id">קטגוריה</Label>
        <Select id="category_id" name="category_id" defaultValue={listing?.category_id ?? ''} required>
          <option value="" disabled>
            בחר/י קטגוריה
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">תיאור</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={listing?.description}
          placeholder="ספר/י על השירות שאת/ה מציע/ה, ניסיון, מה כלול..."
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="price">מחיר (₪)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            step="1"
            defaultValue={listing?.price}
            placeholder="150"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price_unit">יחידת מחיר</Label>
          <Select
            id="price_unit"
            name="price_unit"
            defaultValue={listing?.price_unit ?? 'fixed'}
            required
          >
            {PRICE_UNITS.map((u) => (
              <option key={u} value={u}>
                {PRICE_UNIT_LABELS[u]}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">אזור / מיקום (אופציונלי)</Label>
        <Input
          id="location"
          name="location"
          defaultValue={listing?.location ?? ''}
          placeholder="תל אביב והמרכז"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image_url">קישור לתמונה (אופציונלי)</Label>
        <Input
          id="image_url"
          name="image_url"
          type="url"
          defaultValue={listing?.image_url ?? ''}
          placeholder="https://..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">סטטוס</Label>
        <Select id="status" name="status" defaultValue={listing?.status ?? 'active'}>
          <option value="active">פעיל (מוצג ללקוחות)</option>
          <option value="paused">מושהה</option>
        </Select>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'שומר...' : listing ? 'שמירת שינויים' : 'פרסום מודעה'}
        </Button>
        <Button asChild variant="outline" type="button">
          <Link href="/dashboard">ביטול</Link>
        </Button>
      </div>
    </form>
  )
}
