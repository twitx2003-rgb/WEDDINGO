import { TrendingUp } from 'lucide-react'
import { StockGrid } from '@/components/stocks/StockGrid'

export const metadata = {
  title: 'Stock Picks — Micah Tracker',
}

export default function StocksPage() {
  return (
    <div className="space-y-6">
      <div className="reveal flex items-center gap-3">
        <div className="rounded-xl bg-emerald-500/15 p-2.5">
          <TrendingUp className="h-6 w-6 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Stock Picks</h1>
          <p className="text-sm text-gray-400">Verified investment ideas from Micah&apos;s analysis</p>
        </div>
      </div>
      <StockGrid />
    </div>
  )
}
