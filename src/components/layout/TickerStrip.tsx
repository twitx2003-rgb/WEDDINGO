'use client'

import { useEffect, useState } from 'react'
import { TrendingUp } from 'lucide-react'

interface TickerItem {
  ticker: string
  price: number | null
  targetPrice: number | null
  confidence: number
}

export function TickerStrip() {
  const [items, setItems] = useState<TickerItem[]>([])

  useEffect(() => {
    fetch('/api/stocks/ticker-strip')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setItems(data)
      })
      .catch(() => {})
  }, [])

  if (items.length === 0) return null

  const list = [...items, ...items]

  return (
    <div className="border-b border-white/5 bg-gray-950/70 backdrop-blur-sm overflow-hidden h-8 flex items-center">
      <div className="shrink-0 flex items-center gap-1.5 px-3 border-r border-white/10 h-full bg-blue-500/10">
        <TrendingUp className="h-3 w-3 text-blue-400" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">המלצות קנייה</span>
      </div>
      <div className="flex-1 overflow-hidden" dir="ltr">
        <div className="flex animate-marquee gap-8 whitespace-nowrap">
          {list.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-xs">
              <span className="font-mono font-bold text-emerald-400">{item.ticker}</span>
              {item.price != null && (
                <span className="text-gray-400 font-mono tabular-nums">
                  ${item.price.toFixed(2)}
                </span>
              )}
              {item.targetPrice != null && (
                <span className="text-gray-600 font-mono text-[10px]">
                  → ${item.targetPrice}
                </span>
              )}
              <span className="text-gray-700">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
