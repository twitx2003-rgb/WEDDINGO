import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '20', 10))
  const category = searchParams.get('category')
  const sentiment = searchParams.get('sentiment')
  const search = searchParams.get('search')

  const MARKET_CATEGORIES = ['earnings', 'market_move', 'sector', 'macro']

  const where: Record<string, unknown> = {}
  if (category && category !== 'all') {
    where.category = category
  } else {
    // Default: show only market-relevant categories, exclude generic catch-all items
    where.category = { in: MARKET_CATEGORIES }
  }
  if (sentiment && sentiment !== 'all') where.sentiment = sentiment
  if (search) {
    where.OR = [
      { headline: { contains: search } },
      { body: { contains: search } },
      { tickers: { contains: search.toUpperCase() } },
    ]
  }

  const [items, total] = await Promise.all([
    db.newsItem.findMany({
      where,
      orderBy: [{ publishedAt: 'desc' }, { importance: 'desc' }],
      skip: (page - 1) * limit,
      take: limit,
      include: { video: true },
    }),
    db.newsItem.count({ where }),
  ])

  return NextResponse.json({
    items,
    total,
    page,
    pages: Math.ceil(total / limit),
  })
}
