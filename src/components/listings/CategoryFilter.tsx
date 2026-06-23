'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { Category } from '@/lib/types'

interface Props {
  categories: Category[]
  activeSlug?: string
}

export function CategoryFilter({ categories, activeSlug }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/"
        className={cn(
          'rounded-full border px-4 py-1.5 text-sm transition-colors',
          !activeSlug ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-accent'
        )}
      >
        הכל
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/?category=${cat.slug}`}
          className={cn(
            'rounded-full border px-4 py-1.5 text-sm transition-colors',
            activeSlug === cat.slug
              ? 'border-primary bg-primary text-primary-foreground'
              : 'hover:bg-accent'
          )}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  )
}
