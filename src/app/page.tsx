import Link from 'next/link'
import { Newspaper, TrendingUp, Video, Activity, Settings, ArrowLeft } from 'lucide-react'
import { db } from '@/lib/db'
import { getConfigStatus } from '@/lib/env'
import { Card, CardBody } from '@/components/ui/Card'
import { CountUp } from '@/components/ui/CountUp'
import { tradingViewUrl } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { he } from 'date-fns/locale'

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
    ? formatDistanceToNow(new Date(lastRun.finishedAt), { addSuffix: true, locale: he })
    : null

  return (
    <div className="space-y-12">
      {!isReady && (
        <div className="reveal rounded-xl border border-amber-500/30 bg-amber-500/[0.08] p-4 flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-amber-300">נדרשת הגדרה</p>
            <p className="text-sm text-amber-400/80 mt-0.5">
              הגדר את מפתחות ה-API כדי להתחיל לעקוב אחרי מיקה סטוקס
            </p>
          </div>
          <Link
            href="/settings"
            className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-black hover:bg-amber-400 transition-colors shrink-0"
          >
            <Settings className="h-4 w-4" />
            הגדרה
          </Link>
        </div>
      )}

      {/* Hero */}
      <div className="pt-6">
        <div className="reveal flex items-center gap-2 mb-5">
          <span className="relative flex h-2 w-2">
            <span className="live-dot absolute inline-flex h-full w-full rounded-full bg-emerald-500"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
          </span>
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
            אינטליגנציית שוק בזמן אמת
          </span>
        </div>
        <h1 className="reveal delay-1 text-5xl sm:text-6xl font-bold tracking-tight leading-[1.05]">
          <span className="text-gradient" dir="ltr">Micah Stokes</span>
          <br />
          <span className="text-white/90 text-4xl sm:text-5xl">אינטליגנציית שוק ההון</span>
        </h1>
        <p className="reveal delay-2 text-gray-400 mt-5 text-base max-w-xl leading-relaxed">
          המלצות מניות וחדשות שוק שחולצו בבינה מלאכותית מכל סרטון — כל טיקר מאומת
          אוטומטית מול נתוני שוק חיים.
          {lastRunAgo && (
            <span className="block mt-1 text-sm text-gray-600">עודכן {lastRunAgo}</span>
          )}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          icon={Video}
          label="סרטונים במעקב"
          value={totalVideos}
          accent="blue"
          delay="delay-1"
        />
        <StatCard
          icon={Newspaper}
          label="חדשות היום"
          value={newsToday}
          accent="emerald"
          delay="delay-2"
        />
        <StatCard
          icon={TrendingUp}
          label="המלצות (7 ימים)"
          value={stocksWeek}
          accent="violet"
          delay="delay-3"
        />
        <StatCard
          icon={Activity}
          label="סטטוס הסוכן"
          textValue={statusLabel(lastRun?.status)}
          accent="amber"
          delay="delay-4"
        />
      </div>

      {/* Latest News */}
      <section>
        <div className="reveal flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white tracking-tight">חדשות אחרונות</h2>
          <Link
            href="/news"
            className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors group"
          >
            הצג הכל <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          </Link>
        </div>
        {recentNews.length === 0 ? (
          <Card>
            <CardBody>
              <p className="text-sm text-gray-500 text-center py-6">
                עדיין אין חדשות — הפעל את הסוכן כדי להתחיל
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentNews.map((item, i) => {
              const sentimentBorder =
                item.sentiment === 'bullish'
                  ? 'border-l-emerald-500'
                  : item.sentiment === 'bearish'
                    ? 'border-l-red-500'
                    : 'border-l-gray-600'
              return (
                <div
                  key={item.id}
                  className={`reveal delay-${Math.min(i + 1, 8)} card-lift rounded-xl border border-white/[0.07] bg-white/[0.03] border-l-[3px] ${sentimentBorder}`}
                >
                  <div className="px-4 py-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-white text-sm leading-snug flex-1">
                        {item.headline}
                      </p>
                      {item.importance >= 8 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-300 border border-orange-500/30 shrink-0">
                          Hot
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">{item.body}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Top Stock Picks */}
      <section>
        <div className="reveal flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white tracking-tight">המלצות מובילות</h2>
          <Link
            href="/stocks"
            className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors group"
          >
            הצג הכל <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          </Link>
        </div>
        {topStocks.length === 0 ? (
          <Card>
            <CardBody>
              <p className="text-sm text-gray-500 text-center py-6">
                עדיין אין המלצות — הפעל את הסוכן כדי להתחיל
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {topStocks.map((s, i) => (
              <div
                key={s.id}
                className={`reveal delay-${Math.min(i + 1, 8)} card-lift rounded-xl border border-white/[0.07] bg-white/[0.03] overflow-hidden ${
                  s.action === 'buy'
                    ? 'border-l-[3px] border-l-emerald-500/80'
                    : ''
                }`}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <a
                      href={tradingViewUrl(s.ticker, s.exchange)}
                      target="_blank"
                      rel="noopener noreferrer"
                      dir="ltr"
                      title={`פתח את הגרף של ${s.ticker} ב-TradingView`}
                      className="text-xl font-bold text-white font-mono tracking-tight hover:text-blue-400 transition-colors"
                    >
                      {s.ticker}
                    </a>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                        s.action === 'buy'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : s.action === 'watch'
                            ? 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/30'
                            : 'bg-red-500/15 text-red-300 border border-red-500/30'
                      }`}
                    >
                      {s.action.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{s.companyName}</p>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{s.reason}</p>
                  {s.priceAtTime && (
                    <p className="text-xs text-gray-600 mt-2.5">
                      כניסה <span className="font-mono" dir="ltr">${s.priceAtTime.toFixed(2)}</span>
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

function statusLabel(status?: string): string {
  switch (status) {
    case 'success':
      return 'הצליח'
    case 'running':
      return 'פועל'
    case 'error':
      return 'שגיאה'
    default:
      return 'טרם הופעל'
  }
}

const accentMap = {
  blue: { bg: 'bg-blue-500/15', text: 'text-blue-400' },
  emerald: { bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
  violet: { bg: 'bg-violet-500/15', text: 'text-violet-400' },
  amber: { bg: 'bg-amber-500/15', text: 'text-amber-400' },
}

function StatCard({
  icon: Icon,
  label,
  value,
  textValue,
  accent,
  delay,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value?: number
  textValue?: string
  accent: keyof typeof accentMap
  delay: string
}) {
  const a = accentMap[accent]
  return (
    <div className={`reveal ${delay} card-lift rounded-xl border border-white/[0.07] bg-white/[0.03] p-4`}>
      <div className="flex items-center gap-3">
        <div className={`rounded-lg ${a.bg} p-2.5 shrink-0`}>
          <Icon className={`h-4 w-4 ${a.text}`} />
        </div>
        <div className="min-w-0">
          {textValue !== undefined ? (
            <p className="font-bold text-sm capitalize text-white leading-none truncate">{textValue}</p>
          ) : (
            <CountUp value={value ?? 0} className="font-bold text-2xl text-white leading-none block" />
          )}
          <p className="text-xs text-gray-500 mt-1.5">{label}</p>
        </div>
      </div>
    </div>
  )
}
