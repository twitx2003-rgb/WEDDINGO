import type { StockQuote, HistoricalPoint } from '@/types'

const YF_BASE = 'https://query1.finance.yahoo.com'

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept: 'application/json',
  'Accept-Language': 'en-US,en;q=0.9',
}

async function yahooFetch(url: string): Promise<unknown | null> {
  try {
    const res = await fetch(url, { headers: HEADERS, next: { revalidate: 300 } })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function getQuote(ticker: string): Promise<StockQuote | null> {
  try {
    const url = `${YF_BASE}/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d`
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (await yahooFetch(url)) as any
    const meta = data?.chart?.result?.[0]?.meta
    if (!meta) return null

    return {
      ticker: ticker.toUpperCase(),
      price: meta.regularMarketPrice ?? 0,
      change: (meta.regularMarketPrice ?? 0) - (meta.chartPreviousClose ?? 0),
      changePercent:
        meta.chartPreviousClose
          ? (((meta.regularMarketPrice - meta.chartPreviousClose) / meta.chartPreviousClose) * 100)
          : 0,
      high: meta.regularMarketDayHigh ?? 0,
      low: meta.regularMarketDayLow ?? 0,
      volume: meta.regularMarketVolume ?? 0,
      currency: meta.currency ?? 'USD',
    }
  } catch (err) {
    console.warn(`[StockPrice] Failed to get quote for ${ticker}:`, (err as Error).message)
    return null
  }
}

export async function getHistoricalPrices(ticker: string, days = 30): Promise<HistoricalPoint[]> {
  try {
    const period1 = Math.floor((Date.now() - days * 86400 * 1000) / 1000)
    const period2 = Math.floor(Date.now() / 1000)
    const url = `${YF_BASE}/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&period1=${period1}&period2=${period2}`

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (await yahooFetch(url)) as any
    const result = data?.chart?.result?.[0]
    if (!result) return []

    const timestamps: number[] = result.timestamp ?? []
    const closes: number[] = result.indicators?.quote?.[0]?.close ?? []

    return timestamps
      .map((ts, i) => ({
        date: new Date(ts * 1000).toISOString().split('T')[0],
        close: closes[i] ?? 0,
      }))
      .filter((p) => p.close > 0)
  } catch (err) {
    console.warn(`[StockPrice] Failed to get history for ${ticker}:`, (err as Error).message)
    return []
  }
}
