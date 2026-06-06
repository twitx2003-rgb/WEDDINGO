import { ExternalLink, Quote } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import type { Sentiment } from '@/types'

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

const categoryStyles: Record<string, string> = {
  earnings: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
  market_move: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
  sector: 'bg-teal-500/20 text-teal-300 border border-teal-500/30',
  macro: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  general: 'bg-slate-500/20 text-slate-300 border border-slate-500/30',
}

const categoryLabels: Record<string, string> = {
  earnings: 'Earnings',
  market_move: 'Market Move',
  sector: 'Sector',
  macro: 'Macro',
  general: 'General',
}

const sentimentBorder: Record<string, string> = {
  bullish: 'border-l-emerald-500',
  bearish: 'border-l-red-500',
  neutral: 'border-l-gray-600',
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

  const isHot = importance >= 8
  const borderColor = sentimentBorder[sentiment] ?? 'border-l-gray-600'

  return (
    <div
      className={cn(
        'rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm',
        'border-l-4',
        borderColor,
        'hover:border-white/20 hover:bg-white/[0.07] transition-all',
        isHot && 'shadow-[0_0_12px_rgba(249,115,22,0.12)]'
      )}
    >
      <div className="p-4 space-y-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-white leading-snug flex-1">{headline}</h3>
          <div className="flex items-center gap-1.5 shrink-0">
            <Badge variant={sentiment as Sentiment}>{sentiment}</Badge>
            {isHot && (
              <Badge className="bg-orange-500/20 text-orange-300 border border-orange-500/40 shadow-[0_0_8px_rgba(249,115,22,0.3)]">
                Hot
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
            <span
              className={cn(
                'text-xs px-2 py-0.5 rounded-full',
                categoryStyles[category] ?? categoryStyles.general
              )}
            >
              {categoryLabels[category] ?? category}
            </span>
            {parsedTickers.map((t) => (
              <span
                key={t}
                className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-200 font-mono hover:bg-white/20 transition-colors cursor-default"
              >
                ${t}
              </span>
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
      </div>
    </div>
  )
}
