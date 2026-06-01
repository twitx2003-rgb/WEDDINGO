import yahooFinance from 'yahoo-finance2'
import type { StockQuote, HistoricalPoint } from '@/types'

export async function getQuote(ticker: string): Promise<StockQuote | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const quote = await (yahooFinance as any).quote(ticker)
    return {
      ticker,
      price: quote.regularMarketPrice ?? 0,
      change: quote.regularMarketChange ?? 0,
      changePercent: quote.regularMarketChangePercent ?? 0,
      high: quote.regularMarketDayHigh ?? 0,
      low: quote.regularMarketDayLow ?? 0,
      volume: quote.regularMarketVolume ?? 0,
      currency: quote.currency ?? 'USD',
    }
  } catch (err) {
    console.warn(`[StockPrice] Failed to get quote for ${ticker}:`, (err as Error).message)
    return null
  }
}

export async function getHistoricalPrices(ticker: string, days = 30): Promise<HistoricalPoint[]> {
  try {
    const period1 = new Date()
    period1.setDate(period1.getDate() - days)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (yahooFinance as any).historical(ticker, {
      period1: period1.toISOString().split('T')[0],
      interval: '1d',
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (result as any[]).map((r: any) => ({
      date: (r.date instanceof Date ? r.date : new Date(r.date)).toISOString().split('T')[0],
      close: r.close ?? 0,
    }))
  } catch (err) {
    console.warn(`[StockPrice] Failed to get history for ${ticker}:`, (err as Error).message)
    return []
  }
}
