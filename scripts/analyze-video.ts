import { db } from '../src/lib/db'
import { fetchTranscript } from '../src/lib/skills/youtube'
import { analyzeTranscript } from '../src/lib/skills/analysis'

const videoId = process.argv[2]
if (!videoId) {
  console.error('Usage: npx tsx scripts/analyze-video.ts <videoId>')
  process.exit(1)
}

async function main() {
  console.log(`Fetching transcript for ${videoId}...`)
  const transcript = await fetchTranscript(videoId)
  if (!transcript) {
    console.error('No transcript available for this video')
    process.exit(1)
  }

  console.log(`Transcript length: ${transcript.length} chars`)
  console.log('Analyzing with Claude...\n')

  const result = await analyzeTranscript(
    `Manual analysis of ${videoId}`,
    new Date(),
    transcript
  )

  console.log('=== NEWS ITEMS ===')
  for (const item of result.news) {
    console.log(`\n[${item.importance}/10] ${item.headline}`)
    console.log(`  Category: ${item.category} | Sentiment: ${item.sentiment}`)
    console.log(`  ${item.body}`)
  }

  console.log('\n=== STOCK PICKS ===')
  for (const s of result.stocks) {
    console.log(`\n${s.ticker} (${s.companyName}) — ${s.action.toUpperCase()} [${s.confidence}/10]`)
    console.log(`  ${s.reason}`)
  }
}

main().catch(console.error)
