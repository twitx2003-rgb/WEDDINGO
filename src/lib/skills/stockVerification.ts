import { getQuote, getHistoricalPrices } from './stockPrice'
import type { StockQuote, HistoricalPoint } from '@/types'

const YF_BASE = 'https://query1.finance.yahoo.com'

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept: 'application/json',
  'Accept-Language': 'en-US,en;q=0.9',
}

export interface VerifiedStock {
  verified: boolean
  ticker: string
  companyName: string
  exchange: string | null
  quoteType: string | null
  note: string | null
}

interface YahooSearchQuote {
  symbol: string
  shortname?: string
  longname?: string
  exchDisp?: string
  quoteType?: string
  score?: number
}

async function yahooSearch(query: string): Promise<YahooSearchQuote[]> {
  try {
    const url = `${YF_BASE}/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=6&newsCount=0`
    const res = await fetch(url, { headers: HEADERS, next: { revalidate: 3600 } })
    if (!res.ok) return []
    const data = await res.json()
    return (data?.quotes ?? []) as YahooSearchQuote[]
  } catch {
    return []
  }
}

const TRADEABLE_TYPES = new Set(['EQUITY', 'ETF', 'MUTUALFUND', 'INDEX'])

/**
 * Verify that a ticker mentioned by Micah Stokes actually exists and matches
 * the company. Corrects wrong tickers by searching the company name, and flags
 * non-tradeable mentions (e.g. private companies like SpaceX).
 */
export async function verifyStock(
  ticker: string,
  companyName: string
): Promise<VerifiedStock> {
  const cleanTicker = ticker.trim().toUpperCase()

  // 1. Try the ticker directly
  const bySymbol = await yahooSearch(cleanTicker)
  const exact = bySymbol.find(
    (q) => q.symbol?.toUpperCase() === cleanTicker && TRADEABLE_TYPES.has(q.quoteType ?? '')
  )
  if (exact) {
    return {
      verified: true,
      ticker: exact.symbol.toUpperCase(),
      companyName: exact.longname ?? exact.shortname ?? companyName,
      exchange: exact.exchDisp ?? null,
      quoteType: exact.quoteType ?? null,
      note: null,
    }
  }

  // 2. Ticker didn't resolve — search by company name to find the correct symbol
  if (companyName && companyName.trim().length > 1) {
    const byName = await yahooSearch(companyName)
    const match = byName.find((q) => TRADEABLE_TYPES.has(q.quoteType ?? ''))
    if (match) {
      return {
        verified: true,
        ticker: match.symbol.toUpperCase(),
        companyName: match.longname ?? match.shortname ?? companyName,
        exchange: match.exchDisp ?? null,
        quoteType: match.quoteType ?? null,
        note:
          match.symbol.toUpperCase() !== cleanTicker
            ? `Ticker corrected from ${cleanTicker} to ${match.symbol.toUpperCase()}`
            : null,
      }
    }
  }

  // 3. Could not verify — likely private/not publicly traded or a hallucination
  return {
    verified: false,
    ticker: cleanTicker,
    companyName,
    exchange: null,
    quoteType: null,
    note: 'Could not verify — may be private or not publicly traded',
  }
}

export interface StockAnalysis {
  verification: VerifiedStock
  quote: StockQuote | null
  history: HistoricalPoint[]
  trend: 'up' | 'down' | 'flat' | 'unknown'
  trendPercent: number | null
}

/**
 * Full analysis pass for a single stock: verify the ticker, then pull live
 * price + 30-day history and compute the recent trend.
 */
export async function analyzeStock(
  ticker: string,
  companyName: string
): Promise<StockAnalysis> {
  const verification = await verifyStock(ticker, companyName)

  if (!verification.verified) {
    return {
      verification,
      quote: null,
      history: [],
      trend: 'unknown',
      trendPercent: null,
    }
  }

  const [quote, history] = await Promise.all([
    getQuote(verification.ticker),
    getHistoricalPrices(verification.ticker, 30),
  ])

  let trend: StockAnalysis['trend'] = 'unknown'
  let trendPercent: number | null = null

  if (history.length >= 2) {
    const first = history[0].close
    const last = history[history.length - 1].close
    if (first > 0) {
      trendPercent = ((last - first) / first) * 100
      trend = trendPercent > 1.5 ? 'up' : trendPercent < -1.5 ? 'down' : 'flat'
    }
  }

  return { verification, quote, history, trend, trendPercent }
}
