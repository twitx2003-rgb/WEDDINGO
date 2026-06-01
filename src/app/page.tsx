import Link from 'next/link'
import { Newspaper, TrendingUp, Video, Activity, Settings, ArrowRight } from 'lucide-react'
import { db } from '@/lib/db'
import { getConfigStatus } from '@/lib/env'
import { Card, CardBody } from '@/components/ui/Card'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [configStatus, totalVideos, newsToday, stocksWeek, lastRun, recentNews, topStocks] =
    await Promise.all([
      getConfigStatus(),
      db.video.count(),
      db.newsItem.count({
        where: { publishedAt: { gte: new Date(Date.now() - 86400000) } },
      }),
      db.stockRecommendation.count({
        where: { publishedAt: { gte: new Date(Date.now() - 7 * 86400000) } },
      }),
      db.agentRun.findFirst({ orderBy: { startedAt: 'desc' } }),
      db.newsItem.findMany({
        orderBy: [{ importance: 'desc' }, { publishedAt: 'desc' }],
        take: 3,
        include: { video: true },
      }),
      db.stockRecommendation.findMany({
        orderBy: [{ confidence: 'desc' }, { publishedAt: 'desc' }],
        take: 3,
        include: { video: true },
      }),
    ])

  const isReady = configStatus.youtube && configStatus.channelId && configStatus.claude

  return (
    <div className="space-y-8">
      {!isReady && (
        <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-4 flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-orange-300">Setup required</p>
            <p className="text-sm text-orange-400/80 mt-0.5">
              Configure your API keys to start tracking Micah Stokes
            </p>
          </div>
          <Link
            href="/settings"
            className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-400 transition-colors shrink-0"
          >
            <Settings className="h-4 w-4" />
            Configure
          </Link>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Micah Stokes — Stock Market Intelligence</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={Video} label="Videos tracked" value={totalVideos} />
        <StatCard icon={Newspaper} label="News today" value={newsToday} />
        <StatCard icon={TrendingUp} label="Stock picks (7d)" value={stocksWeek} />
        <StatCard
          icon={Activity}
          label="Agent status"
          value={lastRun?.status ?? 'Never run'}
          isText
        />
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Latest News</h2>
          <Link
            href="/news"
            className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {recentNews.length === 0 ? (
          <Card>
            <CardBody>
              <p className="text-sm text-gray-500 text-center py-6">
                No news yet — run the agent to start
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentNews.map((item) => (
              <Card key={item.id}>
                <CardBody className="py-3">
                  <p className="font-medium text-white text-sm">{item.headline}</p>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.body}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Top Stock Picks</h2>
          <Link
            href="/stocks"
            className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {topStocks.length === 0 ? (
          <Card>
            <CardBody>
              <p className="text-sm text-gray-500 text-center py-6">
                No picks yet — run the agent to start
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {topStocks.map((s) => (
              <Card key={s.id}>
                <CardBody>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl font-bold text-white font-mono">{s.ticker}</span>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${
                        s.action === 'buy'
                          ? 'bg-green-500/20 text-green-300'
                          : s.action === 'watch'
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {s.action.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2">{s.reason}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  isText,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number | string
  isText?: boolean
}) {
  return (
    <Card>
      <CardBody className="flex items-center gap-3 py-3">
        <div className="rounded-lg bg-blue-500/20 p-2">
          <Icon className="h-4 w-4 text-blue-400" />
        </div>
        <div>
          <p
            className={`font-bold ${isText ? 'text-base capitalize' : 'text-2xl'} text-white leading-none`}
          >
            {value}
          </p>
          <p className="text-xs text-gray-400 mt-1">{label}</p>
        </div>
      </CardBody>
    </Card>
  )
}
