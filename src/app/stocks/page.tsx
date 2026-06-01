import { TrendingUp } from 'lucide-react'
import { StockGrid } from '@/components/stocks/StockGrid'

export const metadata = {
  title: 'Stock Picks — Micah Tracker',
}

export default function StocksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-green-500/20 p-2.5">
          <TrendingUp className="h-6 w-6 text-green-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Stock Picks</h1>
          <p className="text-sm text-gray-400">Best investment ideas from Micah's analysis</p>
        </div>
      </div>
      <StockGrid />
    </div>
  )
}
