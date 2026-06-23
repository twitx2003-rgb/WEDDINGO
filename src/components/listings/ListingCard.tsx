import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, ImageIcon } from 'lucide-react'
import { PRICE_UNIT_LABELS, type ListingWithRelations } from '@/lib/types'

export function ListingCard({ listing }: { listing: ListingWithRelations }) {
  return (
    <Link href={`/listings/${listing.id}`} className="group block">
      <Card className="h-full overflow-hidden transition-shadow group-hover:shadow-md">
        <div className="relative aspect-video w-full bg-muted">
          {listing.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={listing.image_url}
              alt={listing.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <ImageIcon className="h-10 w-10" />
            </div>
          )}
          {listing.categories && (
            <Badge className="absolute top-2 right-2" variant="secondary">
              {listing.categories.name}
            </Badge>
          )}
        </div>
        <CardContent className="pt-4">
          <h3 className="font-semibold line-clamp-1">{listing.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{listing.description}</p>
          {listing.location && (
            <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {listing.location}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t pt-3">
          <span className="font-bold text-primary">
            ₪ {listing.price.toLocaleString('he-IL')}
          </span>
          <span className="text-xs text-muted-foreground">
            {PRICE_UNIT_LABELS[listing.price_unit]}
          </span>
        </CardFooter>
      </Card>
    </Link>
  )
}
