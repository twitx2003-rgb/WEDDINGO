import { createAdminClient } from '@/lib/supabase/server'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { CategoryFilter } from '@/components/listings/CategoryFilter'
import { ListingCard } from '@/components/listings/ListingCard'
import { Sparkles } from 'lucide-react'
import type { Category, ListingWithRelations } from '@/lib/types'

interface Props {
  searchParams: Promise<{ category?: string }>
}

export default async function HomePage({ searchParams }: Props) {
  const { category } = await searchParams
  const admin = createAdminClient()

  const { data: categories } = await admin.from('categories').select('*').order('name')

  // Resolve the active category slug -> id for filtering.
  const activeCategory = category
    ? (categories ?? []).find((c) => c.slug === category)
    : undefined

  let query = admin
    .from('listings')
    .select('*, categories(*), profiles(id, name, phone, location, bio)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (activeCategory) {
    query = query.eq('category_id', activeCategory.id)
  }

  const { data: listings } = await query

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center">
          <h1 className="flex items-center justify-center gap-2 text-3xl font-bold sm:text-4xl">
            <Sparkles className="h-8 w-8 text-primary" />
            תחביב־כסף
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            מצאו בעלי תחביב מוכשרים שיתנו לכם שירות במחיר הוגן — או הפכו את התחביב שלכם למקור הכנסה.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <CategoryFilter categories={(categories as Category[]) ?? []} activeSlug={category} />
        </div>

        {listings && listings.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(listings as ListingWithRelations[]).map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-muted-foreground">
            {activeCategory
              ? `אין עדיין מודעות בקטגוריית "${activeCategory.name}"`
              : 'אין עדיין מודעות — היו הראשונים לפרסם!'}
          </div>
        )}
      </main>
    </div>
  )
}
