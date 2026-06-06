import Link from 'next/link'
import { Newspaper, TrendingUp, Video, Activity, Settings, ArrowRight, Zap } from 'lucide-react'
import { db } from '@/lib/db'
import { getConfigStatus } from '@/lib/env'
import { Card, CardBody } from '@/components/ui/Card'
import { formatDistanceToNow } from 'date-fns'

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
        take: 4,
        include: { video: true },
      }),
      db.stockRecommendation.findMany({
        orderBy: [{ confidence: 'desc' }, { publishedAt: 'desc' }],
        take: 3,
        include: { video: true },
      }),
    ])

  const isReady = configStatus.youtube && configStatus.channelId && configStatus.claude
  const lastRunAgo = lastRun?.finishedAt
    ? formatDistanceToNow(new Date(lastRun.finishedAt), { addSuffix: true })
    : null

  return (
    <div className="space-y-10">
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

      {/* Hero */}
      <div className="pt-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-4 w-4 text-blue-400" />
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">
            Live Market Intelligence
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight pb-1">
          Micah Stokes<br className="sm:hidden" />
          <span className="text-white/30 mx-3 hidden sm:inline">·</span>
          <span className="text-3xl sm:text-4xl">Market Intelligence</span>
        </h1>
        <p className="text-gray-400 mt-3 text-sm">
          AI-extracted stock picks and market news from every video and post
          {lastRunAgo && (
            <span className="ml-2 text-gray-600">— last updated {lastRunAgo}</span>
          )}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          icon={Video}
          label="Videos tracked"
          value={totalVideos}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/15"
        />
        <StatCard
          icon={Newspaper}
          label="News today"
          value={newsToday}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/15"
        />
        <StatCard
          icon={TrendingUp}
          label="Stock picks (7d)"
          value={stocksWeek}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/15"
        />
        <StatCard
          icon={Activity}
          label="Agent status"
          value={lastRun?.status ?? 'Never run'}
          isText
          iconColor="text-amber-400"
          iconBg="bg-amber-500/15"
        />
      </div>

      {/* Latest News */}
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
            {recentNews.map((item) => {
              const sentimentBorder =
                item.sentiment === 'bullish'
                  ? 'border-l-emerald-500'
                  : item.sentiment === 'bearish'
                    ? 'border-l-red-500'
                    : 'border-l-gray-600'
              return (
                <div
                  key={item.id}
                  className={`rounded-xl border border-white/10 bg-white/5 border-l-4 ${sentimentBorder} hover:bg-white/[0.07] transition-all`}
                >
                  <div className="px-4 py-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-white text-sm leading-snug flex-1">
                        {item.headline}
                      </p>
                      {item.importance >= 8 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 shrink-0">
                          Hot
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.body}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Top Stock Picks */}
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
              <div
                key={s.id}
                className={`rounded-xl border border-white/10 bg-white/5 overflow-hidden ${
                  s.action === 'buy'
                    ? 'border-l-4 border-l-emerald-500/70 ring-1 ring-emerald-500/10'
                    : ''
                }`}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl font-bold text-white font-mono">{s.ticker}</span>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        s.action === 'buy'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : s.action === 'watch'
                            ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}
                    >
                      {s.action.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 mb-2">{s.companyName}</p>
                  <p className="text-xs text-gray-400 line-clamp-2">{s.reason}</p>
                  {s.priceAtTime && (
                    <p className="text-xs text-gray-600 mt-2 font-mono">
                      Entry ${s.priceAtTime.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
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
  iconColor,
  iconBg,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number | string
  isText?: boolean
  iconColor: string
  iconBg: string
}) {
  return (
    <Card>
      <CardBody className="flex items-center gap-3 py-4">
        <div className={`rounded-lg ${iconBg} p-2.5 shrink-0`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
        <div className="min-w-0">
          <p
            className={`font-bold ${isText ? 'text-sm capitalize' : 'text-2xl font-mono tabular-nums'} text-white leading-none truncate`}
          >
            {value}
          </p>
          <p className="text-xs text-gray-500 mt-1">{label}</p>
        </div>
      </CardBody>
    </Card>
  )
}
