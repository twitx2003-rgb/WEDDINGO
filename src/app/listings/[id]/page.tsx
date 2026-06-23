import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/server'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { ContactReveal } from '@/components/listings/ContactReveal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, ImageIcon, ArrowRight } from 'lucide-react'
import { PRICE_UNIT_LABELS, type ListingWithRelations } from '@/lib/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params
  const admin = createAdminClient()

  const { data } = await admin
    .from('listings')
    .select('*, categories(*), profiles(id, name, phone, location, bio)')
    .eq('id', id)
    .single()

  if (!data) notFound()
  const listing = data as ListingWithRelations
  const hobbyist = listing.profiles

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-4 py-8">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowRight className="h-4 w-4" />
          חזרה לכל המודעות
        </Link>

        <div className="grid gap-6 md:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
              {listing.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={listing.image_url} alt={listing.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  <ImageIcon className="h-12 w-12" />
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                {listing.categories && <Badge variant="secondary">{listing.categories.name}</Badge>}
                {listing.location && (
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {listing.location}
                  </span>
                )}
              </div>
              <h1 className="mt-2 text-2xl font-bold">{listing.title}</h1>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">תיאור השירות</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                  {listing.description}
                </p>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4">
            <Card>
              <CardContent className="space-y-4 pt-6">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    ₪ {listing.price.toLocaleString('he-IL')}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {PRICE_UNIT_LABELS[listing.price_unit]}
                  </div>
                </div>

                {hobbyist && (
                  <div className="border-t pt-3">
                    <p className="text-sm text-muted-foreground">מאת</p>
                    <p className="font-medium">{hobbyist.name}</p>
                    {hobbyist.bio && (
                      <p className="mt-1 text-sm text-muted-foreground">{hobbyist.bio}</p>
                    )}
                  </div>
                )}

                <div className="border-t pt-3">
                  <ContactReveal phone={hobbyist?.phone ?? null} name={hobbyist?.name ?? ''} />
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  )
}
