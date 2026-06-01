import { Newspaper } from 'lucide-react'
import { NewsFeed } from '@/components/news/NewsFeed'

export const metadata = {
  title: 'Market News — Micah Tracker',
}

export default function NewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-blue-500/20 p-2.5">
          <Newspaper className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Market News</h1>
          <p className="text-sm text-gray-400">AI-extracted from Micah Stokes videos</p>
        </div>
      </div>
      <NewsFeed />
    </div>
  )
}
