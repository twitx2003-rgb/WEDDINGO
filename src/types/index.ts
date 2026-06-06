export type Platform = 'youtube' | 'twitter'

export type NewsCategory = 'earnings' | 'market_move' | 'sector' | 'macro' | 'general'
export type Sentiment = 'bullish' | 'bearish' | 'neutral'
export type StockAction = 'buy' | 'watch' | 'sell' | 'avoid'

export interface VideoRecord {
  id: string
  platform: string
  externalId: string
  title: string
  url: string
  publishedAt: Date
  thumbnailUrl: string | null
  isLive: boolean
  analyzed: boolean
}

export interface NewsItemRecord {
  id: string
  videoId: string
  headline: string
  body: string
  category: string
  sentiment: string
  tickers: string
  quote: string | null
  importance: number
  publishedAt: Date
  video?: VideoRecord
}

export interface StockRecommendationRecord {
  id: string
  videoId: string
  ticker: string
  companyName: string
  action: string
  confidence: number
  reason: string
  quote: string | null
  priceAtTime: number | null
  targetPrice: number | null
  verified: boolean
  exchange: string | null
  publishedAt: Date
  video?: VideoRecord
}

export interface AgentRunRecord {
  id: string
  startedAt: Date
  finishedAt: Date | null
  status: string
  videosFound: number
  videosAnalyzed: number
  newsExtracted: number
  stocksExtracted: number
  errorMessage: string | null
}

export interface StockQuote {
  ticker: string
  price: number
  change: number
  changePercent: number
  high: number
  low: number
  volume: number
  currency: string
}

export interface HistoricalPoint {
  date: string
  close: number
}

export interface ExtractedNews {
  headline: string
  body: string
  category: NewsCategory
  sentiment: Sentiment
  tickers: string[]
  quote?: string
  importance: number
}

export interface ExtractedStock {
  ticker: string
  companyName: string
  action: StockAction
  confidence: number
  reason: string
  quote?: string
  targetPrice?: number
}

export interface AnalysisResult {
  news: ExtractedNews[]
  stocks: ExtractedStock[]
}
