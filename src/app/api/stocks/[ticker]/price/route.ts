import { NextRequest, NextResponse } from 'next/server'
import { getQuote, getHistoricalPrices } from '@/lib/skills/stockPrice'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params

  const [quote, history] = await Promise.all([
    getQuote(ticker),
    getHistoricalPrices(ticker, 30),
  ])

  return NextResponse.json(
    { quote, history },
    { headers: { 'Cache-Control': 'public, max-age=300, s-maxage=300' } }
  )
}
