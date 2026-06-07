import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const action = searchParams.get('action')
  const minConfidence = parseInt(searchParams.get('minConfidence') ?? '1', 10)
  const ticker = searchParams.get('ticker')

  const where: Record<string, unknown> = {
    confidence: { gte: minConfidence },
  }
  if (action && action !== 'all') where.action = action
  if (ticker) where.ticker = ticker.toUpperCase()

  // Get all recommendations, then deduplicate by ticker (latest + highest confidence)
  const all = await db.stockRecommendation.findMany({
    where,
    orderBy: [{ publishedAt: 'desc' }, { confidence: 'desc' }],
    include: { video: true },
  })

  // Deduplicate: keep best per ticker
  const seen = new Set<string>()
  const deduplicated = all.filter((s) => {
    if (seen.has(s.ticker)) return false
    seen.add(s.ticker)
    return true
  })

  return NextResponse.json({ stocks: deduplicated, total: deduplicated.length })
}
