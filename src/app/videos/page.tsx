import Link from 'next/link'
import { Video, ExternalLink, Newspaper, TrendingUp, BadgeCheck } from 'lucide-react'
import { db } from '@/lib/db'
import { tradingViewUrl } from '@/lib/utils'
import { format } from 'date-fns'
import { he } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'סיכומי סרטונים — מעקב מיקה סטוקס',
}

const sentimentBorder: Record<string, string> = {
  bullish: 'border-r-emerald-500',
  bearish: 'border-r-red-500',
  neutral: 'border-r-gray-600',
}

const sentimentDot: Record<string, string> = {
  bullish: 'bg-emerald-400',
  bearish: 'bg-red-400',
  neutral: 'bg-gray-500',
}

const actionColor: Record<string, string> = {
  buy: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  watch: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  sell: 'bg-red-500/15 text-red-300 border-red-500/30',
  avoid: 'bg-red-500/15 text-red-300 border-red-500/30',
}

const actionLabel: Record<string, string> = {
  buy: 'קנייה',
  watch: 'מעקב',
  sell: 'מכירה',
  avoid: 'הימנעות',
}

export default async function VideosPage() {
  // Note: schema field names are inverted — stockRecs holds NewsItem[], newsItems holds StockRecommendation[]
  const videos = await db.video.findMany({
    where: { platform: 'youtube', analyzed: true },
    orderBy: { publishedAt: 'desc' },
    take: 15,
    include: {
      stockRecs: { orderBy: [{ importance: 'desc' }] },
      newsItems: { orderBy: [{ confidence: 'desc' }] },
    },
  })

  const videosWithContent = videos
    .filter((v) => v.stockRecs.length > 0 || v.newsItems.length > 0)
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="reveal flex items-center gap-3">
        <div className="rounded-xl bg-violet-500/15 p-2.5">
          <Video className="h-6 w-6 text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">סיכומי סרטונים</h1>
          <p className="text-sm text-gray-400">ניתוח מלא של 5 הסרטונים האחרונים</p>
        </div>
      </div>

      {videosWithContent.length === 0 ? (
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-10 text-center">
          <Video className="h-10 w-10 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">עדיין אין סרטונים מנותחים</p>
          <p className="text-sm text-gray-600 mt-1">הפעל את הסוכן כדי להתחיל</p>
        </div>
      ) : (
        <div className="space-y-8">
          {videosWithContent.map((video, i) => {
            const news = video.stockRecs   // NewsItem[] — schema naming is inverted
            const stocks = video.newsItems // StockRecommendation[] — schema naming is inverted
            const parsedDate = format(new Date(video.publishedAt), 'EEEE, d בMMMM yyyy', { locale: he })

            return (
              <article
                key={video.id}
                className={`reveal delay-${Math.min(i + 1, 4)} rounded-2xl border border-white/[0.08] bg-white/[0.025] overflow-hidden`}
              >
                {/* Video header */}
                <div className="flex items-start gap-4 p-5 border-b border-white/[0.06]">
                  {video.thumbnailUrl && (
                    <a href={video.url} target="_blank" rel="noopener noreferrer" className="shrink-0">
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-32 h-[72px] rounded-lg object-cover hover:opacity-80 transition-opacity"
                      />
                    </a>
                  )}
                  <div className="flex-1 min-w-0">
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-1.5"
                    >
                      <h2 className="font-semibold text-white leading-snug text-base group-hover:text-blue-400 transition-colors line-clamp-2">
                        {video.title}
                      </h2>
                      <ExternalLink className="h-3.5 w-3.5 text-gray-500 group-hover:text-blue-400 mt-0.5 shrink-0 transition-colors" />
                    </a>
                    <p className="text-sm text-gray-400 mt-1.5">{parsedDate}</p>
                    <div className="flex items-center gap-3 mt-2">
                      {news.length > 0 && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Newspaper className="h-3 w-3" />
                          {news.length} חדשות
                        </span>
                      )}
                      {stocks.length > 0 && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <TrendingUp className="h-3 w-3" />
                          {stocks.length} מניות
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-5">
                  {/* News section */}
                  {news.length > 0 && (
                    <section>
                      <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2">
                        <Newspaper className="h-3.5 w-3.5" />
                        חדשות ועדכונים
                      </h3>
                      <div className="space-y-2">
                        {news.map((item) => {
                          const border = sentimentBorder[item.sentiment] ?? sentimentBorder.neutral
                          const dot = sentimentDot[item.sentiment] ?? sentimentDot.neutral
                          let tickers: string[] = []
                          try { tickers = JSON.parse(item.tickers) } catch { /* ignore */ }

                          return (
                            <div
                              key={item.id}
                              className={`rounded-lg border border-white/[0.06] bg-white/[0.03] border-r-[3px] ${border} px-4 py-3`}
                            >
                              <div className="flex items-start gap-2">
                                <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${dot}`} />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-white leading-snug">
                                    {item.headline}
                                    {item.importance >= 8 && (
                                      <span className="mr-2 text-[10px] px-1.5 py-0.5 rounded-full bg-orange-500/15 text-orange-300 border border-orange-500/30">
                                        חם
                                      </span>
                                    )}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2">
                                    {item.body}
                                  </p>
                                  {tickers.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1.5">
                                      {tickers.map((t) => (
                                        <a
                                          key={t}
                                          href={tradingViewUrl(t)}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          dir="ltr"
                                          className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300 font-mono hover:bg-blue-500/20 hover:text-blue-300 transition-colors"
                                        >
                                          {t}
                                        </a>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </section>
                  )}

                  {/* Stocks section */}
                  {stocks.length > 0 && (
                    <section>
                      <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2">
                        <TrendingUp className="h-3.5 w-3.5" />
                        המלצות מניות
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {stocks.map((s) => {
                          const colors = actionColor[s.action] ?? actionColor.watch
                          return (
                            <div
                              key={s.id}
                              className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-3 flex items-start gap-3"
                            >
                              <div className="shrink-0 flex flex-col items-center gap-1.5 pt-0.5">
                                <a
                                  href={tradingViewUrl(s.ticker, s.exchange)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  dir="ltr"
                                  title={`פתח גרף ב-TradingView`}
                                  className="text-base font-bold text-white font-mono hover:text-blue-400 transition-colors"
                                >
                                  {s.ticker}
                                </a>
                                {s.verified && (
                                  <BadgeCheck className="h-3.5 w-3.5 text-blue-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${colors}`}>
                                    {actionLabel[s.action] ?? s.action}
                                  </span>
                                  <span className="text-[10px] text-gray-500">{s.companyName}</span>
                                  {s.priceAtTime && (
                                    <span className="text-[10px] text-gray-600 font-mono ms-auto" dir="ltr">
                                      ${s.priceAtTime.toFixed(2)}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{s.reason}</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </section>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}

      <div className="text-center pt-2">
        <Link
          href="/news"
          className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          לכל החדשות ←
        </Link>
      </div>
    </div>
  )
}
