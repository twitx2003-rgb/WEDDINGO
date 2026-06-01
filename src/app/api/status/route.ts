import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAgentState } from '@/lib/agent/state'

export async function GET() {
  const [lastRun, totalVideos, newsToday, stocksWeek] = await Promise.all([
    db.agentRun.findFirst({ orderBy: { startedAt: 'desc' } }),
    db.video.count(),
    db.newsItem.count({
      where: {
        publishedAt: { gte: new Date(Date.now() - 86400000) },
      },
    }),
    db.stockRecommendation.count({
      where: {
        publishedAt: { gte: new Date(Date.now() - 7 * 86400000) },
      },
    }),
  ])

  const inMemoryState = getAgentState()

  return NextResponse.json({
    agentStatus: inMemoryState.status,
    lastRun,
    stats: {
      totalVideos,
      newsToday,
      stocksWeek,
    },
  })
}
