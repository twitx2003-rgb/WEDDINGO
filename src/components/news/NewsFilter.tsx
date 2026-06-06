'use client'

import { cn } from '@/lib/utils'

interface NewsFilterProps {
  category: string
  sentiment: string
  search: string
  onCategoryChange: (v: string) => void
  onSentimentChange: (v: string) => void
  onSearchChange: (v: string) => void
}

const categories = [
  { value: 'all', label: 'הכל' },
  { value: 'earnings', label: 'דוחות' },
  { value: 'market_move', label: 'תנועת שוק' },
  { value: 'sector', label: 'סקטור' },
  { value: 'macro', label: 'מאקרו' },
  { value: 'general', label: 'כללי' },
]

const sentiments = [
  { value: 'all', label: 'הכל' },
  { value: 'bullish', label: 'חיובי' },
  { value: 'bearish', label: 'שלילי' },
  { value: 'neutral', label: 'ניטרלי' },
]

export function NewsFilter({
  category,
  sentiment,
  search,
  onCategoryChange,
  onSentimentChange,
  onSearchChange,
}: NewsFilterProps) {
  return (
    <div className="space-y-3">
      <input
        type="search"
        placeholder="חיפוש לפי מילת מפתח או טיקר $..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30"
      />
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c.value}
            onClick={() => onCategoryChange(c.value)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              category === c.value
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            )}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        {sentiments.map((s) => (
          <button
            key={s.value}
            onClick={() => onSentimentChange(s.value)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              sentiment === s.value
                ? s.value === 'bullish'
                  ? 'bg-green-500 text-white'
                  : s.value === 'bearish'
                    ? 'bg-red-500 text-white'
                    : 'bg-blue-500 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}
