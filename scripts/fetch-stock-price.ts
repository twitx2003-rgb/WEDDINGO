import { getQuote, getHistoricalPrices } from '../src/lib/skills/stockPrice'

const ticker = process.argv[2]
if (!ticker) {
  console.error('Usage: npx tsx scripts/fetch-stock-price.ts <TICKER>')
  process.exit(1)
}

async function main() {
  console.log(`Fetching data for ${ticker.toUpperCase()}...`)

  const [quote, history] = await Promise.all([
    getQuote(ticker),
    getHistoricalPrices(ticker, 30),
  ])

  if (!quote) {
    console.error('Failed to fetch quote')
    process.exit(1)
  }

  console.log(`\nPrice: $${quote.price.toFixed(2)}`)
  console.log(`Change: ${quote.change >= 0 ? '+' : ''}${quote.change.toFixed(2)} (${quote.changePercent.toFixed(2)}%)`)
  console.log(`High: $${quote.high.toFixed(2)} | Low: $${quote.low.toFixed(2)}`)
  console.log(`Volume: ${quote.volume.toLocaleString()}`)
  console.log(`\n30-day history: ${history.length} data points`)
  if (history.length > 0) {
    console.log(`  From: $${history[0].close.toFixed(2)} on ${history[0].date}`)
    console.log(`  To:   $${history[history.length - 1].close.toFixed(2)} on ${history[history.length - 1].date}`)
  }
}

main().catch(console.error)
