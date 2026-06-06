import { db } from '../src/lib/db'

/**
 * One-time reset: delete all extracted news + stock recommendations and mark
 * every video as unanalyzed, so the agent regenerates the content from scratch
 * (e.g. after changing the analysis language to Hebrew).
 */
async function main() {
  const news = await db.newsItem.deleteMany({})
  const stocks = await db.stockRecommendation.deleteMany({})
  const videos = await db.video.updateMany({ data: { analyzed: false } })
  console.log(
    `[Reset] Deleted ${news.count} news, ${stocks.count} stocks; reset ${videos.count} videos to unanalyzed.`
  )
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[Reset] Error:', err)
    process.exit(1)
  })
