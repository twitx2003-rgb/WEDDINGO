import { analyzeStock } from '../src/lib/skills/stockVerification'

const ticker = process.argv[2]
const companyName = process.argv[3] ?? ''

if (!ticker) {
  console.error('Usage: npx tsx scripts/verify-stock.ts <TICKER> [companyName]')
  process.exit(1)
}

analyzeStock(ticker, companyName)
  .then((analysis) => {
    console.log(JSON.stringify(analysis, null, 2))
    process.exit(0)
  })
  .catch((err) => {
    console.error('[VerifyStock] Error:', err)
    process.exit(1)
  })
