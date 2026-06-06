import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const stocks = await db.stockRecommendation.findMany({
    where: { action: 'buy' },
    orderBy: [{ confidence: 'desc' }, { publishedAt: 'desc' }],
    take: 12,
    distinct: ['ticker'],
  })

  return NextResponse.json(
    stocks.map((s) => ({
      ticker: s.ticker,
      price: s.priceAtTime,
      targetPrice: s.targetPrice,
      confidence: s.confidence,
    }))
  )
}
