'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { ExternalLink, TrendingUp, TrendingDown, Minus, Quote } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/Badge'
import { Card, CardBody } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import type { StockQuote, HistoricalPoint, StockAction } from '@/types'

const MiniChart = dynamic(() => import('./MiniChart').then((m) => m.MiniChart), { ssr: false })

interface StockCardProps {
  ticker: string
  companyName: string
  action: string
  confidence: number
  reason: string
  quote?: string | null
  priceAtTime?: number | null
  targetPrice?: number | null
  publishedAt: string | Date
  sourceTitle?: string
  sourceUrl?: string
  platform?: string
}

export function StockCard({
  ticker,
  companyName,
  action,
  confidence,
  reason,
  quote,
  priceAtTime,
  targetPrice,
  publishedAt,
  sourceTitle,
  sourceUrl,
  platform,
}: StockCardProps) {
  const [priceData, setPriceData] = useState<{
    quote: StockQuote | null
    history: HistoricalPoint[]
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/stocks/${ticker}/price`)
      .then((r) => r.json())
      .then(setPriceData)
      .catch(() => setPriceData({ quote: null, history: [] }))
      .finally(() => setLoading(false))
  }, [ticker])

  const currentPrice = priceData?.quote?.price
  const changePercent = priceData?.quote?.changePercent ?? 0
  const isPositive = changePercent >= 0
  const history = priceData?.history ?? []

  const vsEntry =
    currentPrice && priceAtTime
      ? (((currentPrice - priceAtTime) / priceAtTime) * 100).toFixed(1)
      : null

  const cardVariant = action === 'buy' ? 'buy' : action === 'sell' ? 'bearish' : 'default'

  return (
    <Card variant={cardVariant} className="hover:border-white/20 transition-colors overflow-hidden">
      {/* Chart */}
      <div className="bg-white/[0.02]">
        {loading ? (
          <Skeleton className="h-24 w-full rounded-none" />
        ) : history.length > 0 ? (
          <MiniChart data={history} isPositive={isPositive} entryPrice={priceAtTime} />
        ) : (
          <div className="h-24 flex items-center justify-center text-xs text-gray-600">
            No chart data
          </div>
        )}
      </div>

      <CardBody className="space-y-3">
        {/* Ticker + Action */}
        <div className="flex items-start justify-between">
          <div>
            <span className="text-2xl font-bold text-white font-mono tracking-tight">{ticker}</span>
            <p className="text-xs text-gray-400 mt-0.5">{companyName}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={action as StockAction} className="text-sm font-bold px-3 py-1">
              {action.toUpperCase()}
            </Badge>
            <div className="w-20">
              <div className="h-1 rounded-full bg-white/10">
                <div
                  className="h-1 rounded-full bg-blue-400 transition-all"
                  style={{ width: `${confidence * 10}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-0.5 text-right">{confidence}/10 conf</p>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-3 flex-wrap">
          {loading ? (
            <Skeleton className="h-8 w-24" />
          ) : currentPrice ? (
            <>
              <span className="text-2xl font-bold text-white font-mono tabular-nums">
                ${currentPrice.toFixed(2)}
              </span>
              <span
                className={`flex items-center gap-0.5 text-sm font-semibold ${
                  isPositive ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : changePercent === 0 ? (
                  <Minus className="h-3.5 w-3.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}
                {Math.abs(changePercent).toFixed(2)}%
              </span>
              {vsEntry !== null && (
                <span
                  className={`text-xs font-mono ${
                    parseFloat(vsEntry) >= 0 ? 'text-emerald-400/70' : 'text-red-400/70'
                  }`}
                >
                  {parseFloat(vsEntry) >= 0 ? '+' : ''}{vsEntry}% vs entry
                </span>
              )}
              {targetPrice && (
                <span className="text-xs text-gray-400 ml-auto">
                  Target: <span className="text-white font-mono">${targetPrice}</span>
                </span>
              )}
            </>
          ) : (
            <span className="text-sm text-gray-500">Price unavailable</span>
          )}
        </div>

        {/* Reason */}
        <p className="text-sm text-gray-300 leading-relaxed">{reason}</p>

        {/* Quote */}
        {quote && (
          <div className="flex gap-2 rounded-lg bg-white/5 p-3 border-l-2 border-blue-500/50">
            <Quote className="h-3 w-3 text-blue-400 mt-0.5 shrink-0" />
            <p className="text-xs text-gray-400 italic leading-relaxed">{quote}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
          <span>{formatDistanceToNow(new Date(publishedAt), { addSuffix: true })}</span>
          <div className="flex items-center gap-2">
            {priceAtTime && (
              <span className="font-mono">Entry ${priceAtTime.toFixed(2)}</span>
            )}
            {sourceUrl && (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
              >
                {platform === 'twitter' ? 'X' : 'YouTube'}
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
