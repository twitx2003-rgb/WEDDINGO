import { ExternalLink, Quote } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/Badge'
import { Card, CardBody } from '@/components/ui/Card'
import type { Sentiment, NewsCategory } from '@/types'

interface NewsCardProps {
  headline: string
  body: string
  category: string
  sentiment: string
  tickers: string[]
  quote?: string | null
  importance: number
  publishedAt: string | Date
  sourceTitle?: string
  sourceUrl?: string
  platform?: string
}

const categoryLabels: Record<string, string> = {
  earnings: 'Earnings',
  market_move: 'Market Move',
  sector: 'Sector',
  macro: 'Macro',
  general: 'General',
}

export function NewsCard({
  headline,
  body,
  category,
  sentiment,
  tickers,
  quote,
  importance,
  publishedAt,
  sourceTitle,
  sourceUrl,
  platform,
}: NewsCardProps) {
  const parsedTickers: string[] = Array.isArray(tickers)
    ? tickers
    : (() => {
        try {
          return JSON.parse(tickers as unknown as string)
        } catch {
          return []
        }
      })()

  return (
    <Card className="hover:border-white/20 transition-colors">
      <CardBody className="space-y-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-white leading-snug flex-1">{headline}</h3>
          <div className="flex items-center gap-1.5 shrink-0">
            <Badge variant={sentiment as Sentiment}>{sentiment}</Badge>
            {importance >= 8 && (
              <Badge className="bg-orange-500/20 text-orange-300 border border-orange-500/40">
                🔥 Hot
              </Badge>
            )}
          </div>
        </div>

        {/* Body */}
        <p className="text-gray-300 text-sm leading-relaxed">{body}</p>

        {/* Quote */}
        {quote && (
          <div className="flex gap-2 rounded-lg bg-white/5 p-3 border-l-2 border-blue-500/50">
            <Quote className="h-3 w-3 text-blue-400 mt-0.5 shrink-0" />
            <p className="text-gray-400 text-xs italic leading-relaxed">{quote}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex flex-wrap gap-1.5 items-center">
            <Badge className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {categoryLabels[category] ?? category}
            </Badge>
            {parsedTickers.map((t) => (
              <Badge key={t} className="bg-white/10 text-gray-200 font-mono text-xs">
                ${t}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500 shrink-0">
            <span>{formatDistanceToNow(new Date(publishedAt), { addSuffix: true })}</span>
            {sourceUrl && (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <span className="hidden sm:inline">{platform === 'twitter' ? 'X' : 'YouTube'}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
