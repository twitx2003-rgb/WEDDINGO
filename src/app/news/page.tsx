import { Newspaper } from 'lucide-react'
import { NewsFeed } from '@/components/news/NewsFeed'

export const metadata = {
  title: 'חדשות שוק — מעקב מיקה סטוקס',
}

export default function NewsPage() {
  return (
    <div className="space-y-6">
      <div className="reveal flex items-center gap-3">
        <div className="rounded-xl bg-blue-500/15 p-2.5">
          <Newspaper className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">חדשות שוק</h1>
          <p className="text-sm text-gray-400">חולצו בבינה מלאכותית מסרטוני מיקה סטוקס</p>
        </div>
      </div>
      <NewsFeed />
    </div>
  )
}
