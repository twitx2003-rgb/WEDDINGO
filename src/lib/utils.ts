import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Map Yahoo Finance exchange display names to TradingView exchange prefixes
const TV_EXCHANGE: Record<string, string> = {
  NasdaqGS: 'NASDAQ',
  NasdaqGM: 'NASDAQ',
  NasdaqCM: 'NASDAQ',
  NMS: 'NASDAQ',
  Nasdaq: 'NASDAQ',
  NYSE: 'NYSE',
  NYQ: 'NYSE',
  'NYSE American': 'AMEX',
  'NYSEArca': 'AMEX',
  'Tel Aviv': 'TASE',
  TLV: 'TASE',
}

/** Build a TradingView chart URL for a ticker, qualified by exchange when known. */
export function tradingViewUrl(ticker: string, exchange?: string | null): string {
  const symbol = exchange && TV_EXCHANGE[exchange]
    ? `${TV_EXCHANGE[exchange]}:${ticker}`
    : ticker
  return `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(symbol)}`
}
