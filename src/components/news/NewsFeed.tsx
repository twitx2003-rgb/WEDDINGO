'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Newspaper } from 'lucide-react'
import { NewsCard } from './NewsCard'
import { NewsFilter } from './NewsFilter'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function NewsFeed() {
  const [category, setCategory] = useState('all')
  const [sentiment, setSentiment] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const params = new URLSearchParams({ page: String(page), limit: '20' })
  if (category !== 'all') params.set('category', category)
  if (sentiment !== 'all') params.set('sentiment', sentiment)
  if (search) params.set('search', search)

  const { data, isLoading } = useSWR(`/api/news?${params}`, fetcher, {
    refreshInterval: 300000, // 5 min
  })

  const handleFilterChange = (type: 'category' | 'sentiment' | 'search', value: string) => {
    setPage(1)
    if (type === 'category') setCategory(value)
    else if (type === 'sentiment') setSentiment(value)
    else setSearch(value)
  }

  return (
    <div className="space-y-6">
      <NewsFilter
        category={category}
        sentiment={sentiment}
        search={search}
        onCategoryChange={(v) => handleFilterChange('category', v)}
        onSentimentChange={(v) => handleFilterChange('sentiment', v)}
        onSearchChange={(v) => handleFilterChange('search', v)}
      />

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      ) : data?.items?.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title="No news yet"
          description="The agent hasn't extracted any news items yet. Make sure your API keys are configured and click 'Run Agent Now' in Settings."
        />
      ) : (
        <>
          <div className="text-xs text-gray-500">{data?.total ?? 0} items</div>
          <div className="space-y-4">
            {data?.items?.map(
              (item: {
                id: string
                headline: string
                body: string
                category: string
                sentiment: string
                tickers: string
                quote?: string
                importance: number
                publishedAt: string
                video?: { url: string; platform: string; title: string }
              }) => (
                <NewsCard
                  key={item.id}
                  headline={item.headline}
                  body={item.body}
                  category={item.category}
                  sentiment={item.sentiment}
                  tickers={(() => {
                    try {
                      return JSON.parse(item.tickers)
                    } catch {
                      return []
                    }
                  })()}
                  quote={item.quote}
                  importance={item.importance}
                  publishedAt={item.publishedAt}
                  sourceTitle={item.video?.title}
                  sourceUrl={item.video?.url}
                  platform={item.video?.platform}
                />
              )
            )}
          </div>

          {/* Pagination */}
          {data?.pages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg px-4 py-2 text-sm bg-white/10 text-gray-300 disabled:opacity-40 hover:bg-white/20 transition-colors"
              >
                Previous
              </button>
              <span className="rounded-lg px-4 py-2 text-sm text-gray-400">
                {page} / {data.pages}
              </span>
              <button
                disabled={page === data.pages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg px-4 py-2 text-sm bg-white/10 text-gray-300 disabled:opacity-40 hover:bg-white/20 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
