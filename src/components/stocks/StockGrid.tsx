'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { TrendingUp } from 'lucide-react'
import { StockCard } from './StockCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { cn } from '@/lib/utils'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const actions = ['all', 'buy', 'watch', 'sell', 'avoid']

const actionLabels: Record<string, string> = {
  all: 'הכל',
  buy: 'קנייה',
  watch: 'מעקב',
  sell: 'מכירה',
  avoid: 'הימנעות',
}

export function StockGrid() {
  const [action, setAction] = useState('all')
  const [minConfidence, setMinConfidence] = useState(1)

  const params = new URLSearchParams({ minConfidence: String(minConfidence) })
  if (action !== 'all') params.set('action', action)

  const { data, isLoading } = useSWR(`/api/stocks?${params}`, fetcher, {
    refreshInterval: 300000,
  })

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex gap-2">
          {actions.map((a) => (
            <button
              key={a}
              onClick={() => setAction(a)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors',
                action === a
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              )}
            >
              {actionLabels[a] ?? a}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>ביטחון מינימלי:</span>
          <input
            type="range"
            min={1}
            max={10}
            value={minConfidence}
            onChange={(e) => setMinConfidence(Number(e.target.value))}
            className="w-24 accent-blue-500"
          />
          <span className="text-white font-medium w-4">{minConfidence}</span>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : data?.stocks?.length === 0 ? (
        <EmptyState
          icon={TrendingUp}
          title="עדיין אין המלצות מניות"
          description="הסוכן עדיין לא מצא המלצות. ודא שמפתחות ה-API מוגדרים והפעל את הסוכן מעמוד ההגדרות."
        />
      ) : (
        <>
          <div className="text-xs text-gray-500">{data?.total ?? 0} המלצות ייחודיות</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.stocks?.map(
              (stock: {
                id: string
                ticker: string
                companyName: string
                action: string
                confidence: number
                reason: string
                quote?: string
                priceAtTime?: number
                targetPrice?: number
                verified?: boolean
                exchange?: string
                publishedAt: string
                video?: { url: string; platform: string; title: string }
              }) => (
                <StockCard
                  key={stock.id}
                  ticker={stock.ticker}
                  companyName={stock.companyName}
                  action={stock.action}
                  confidence={stock.confidence}
                  reason={stock.reason}
                  quote={stock.quote}
                  priceAtTime={stock.priceAtTime}
                  targetPrice={stock.targetPrice}
                  verified={stock.verified}
                  exchange={stock.exchange}
                  publishedAt={stock.publishedAt}
                  sourceTitle={stock.video?.title}
                  sourceUrl={stock.video?.url}
                  platform={stock.video?.platform}
                />
              )
            )}
          </div>
        </>
      )}
    </div>
  )
}
