import { db } from '../db'
import { listRecentVideos, fetchTranscript } from '../skills/youtube'
import { analyzeTranscript } from '../skills/analysis'
import { getQuote } from '../skills/stockPrice'
import { fetchRecentTweets } from '../platforms/twitter'
import { analyzeTranscript as analyzeTweets } from '../skills/analysis'
import { setAgentRunning, setAgentIdle, setAgentError } from './state'

export async function runAgent(): Promise<void> {
  console.log('[Agent] Starting run...')

  // Create AgentRun record
  const run = await db.agentRun.create({
    data: { status: 'running' },
  })

  setAgentRunning(run.id)

  let videosFound = 0
  let videosAnalyzed = 0
  let newsExtracted = 0
  let stocksExtracted = 0

  try {
    // Step 2: Fetch recent YouTube videos
    const videos = await listRecentVideos(14)
    videosFound += videos.length
    console.log(`[Agent] Found ${videos.length} YouTube videos`)

    // Store new videos in DB
    const newVideoIds: string[] = []
    for (const video of videos) {
      const existing = await db.video.findUnique({ where: { externalId: video.id } })
      if (!existing) {
        const created = await db.video.create({
          data: {
            platform: 'youtube',
            externalId: video.id,
            title: video.title,
            description: video.description,
            url: video.url,
            publishedAt: video.publishedAt,
            channelId: video.channelId,
            thumbnailUrl: video.thumbnailUrl,
            isLive: video.isLive,
          },
        })
        newVideoIds.push(created.id)
      }
    }

    // Step 3: Fetch transcripts for unanalyzed videos
    const unanalyzed = await db.video.findMany({
      where: { analyzed: false, platform: 'youtube' },
    })

    for (const video of unanalyzed) {
      const transcript = await fetchTranscript(video.externalId)
      if (transcript) {
        await db.video.update({
          where: { id: video.id },
          data: { transcriptFetched: true },
        })

        // Step 4: Analyze with Claude
        console.log(`[Agent] Analyzing: ${video.title}`)
        const result = await analyzeTranscript(video.title, video.publishedAt, transcript)

        // Store news items
        for (const item of result.news) {
          await db.newsItem.create({
            data: {
              videoId: video.id,
              headline: item.headline,
              body: item.body,
              category: item.category,
              sentiment: item.sentiment,
              tickers: JSON.stringify(item.tickers ?? []),
              quote: item.quote ?? null,
              importance: item.importance,
              publishedAt: video.publishedAt,
            },
          })
          newsExtracted++
        }

        // Step 5: Store stock picks + fetch current price
        for (const stock of result.stocks) {
          const quote = await getQuote(stock.ticker)
          await db.stockRecommendation.create({
            data: {
              videoId: video.id,
              ticker: stock.ticker.toUpperCase(),
              companyName: stock.companyName,
              action: stock.action,
              confidence: stock.confidence,
              reason: stock.reason,
              quote: stock.quote ?? null,
              priceAtTime: quote?.price ?? null,
              targetPrice: stock.targetPrice ?? null,
              publishedAt: video.publishedAt,
            },
          })
          stocksExtracted++
        }

        videosAnalyzed++
      } else {
        // No transcript available (live/Shorts) — mark as done
      }

      await db.video.update({
        where: { id: video.id },
        data: { analyzed: true },
      })
    }

    // Step 6: Optional Twitter fetch
    const tweets = await fetchRecentTweets(20)
    if (tweets.length > 0) {
      console.log(`[Agent] Processing ${tweets.length} tweets`)
      const tweetText = tweets.map((t) => t.text).join('\n---\n')
      const tweetResult = await analyzeTweets(
        'Twitter/X posts by Micah Stokes',
        new Date(),
        tweetText
      )

      for (const tweet of tweets) {
        const existing = await db.video.findUnique({ where: { externalId: tweet.id } })
        if (!existing) {
          await db.video.create({
            data: {
              platform: 'twitter',
              externalId: tweet.id,
              title: tweet.text.slice(0, 100),
              url: tweet.url,
              publishedAt: tweet.createdAt,
              analyzed: true,
              transcriptFetched: true,
            },
          })
          videosFound++
        }
      }

      // Store the analysis results linked to a synthetic video record
      // For simplicity, create one combined Twitter video record for this batch
      if (tweetResult.news.length > 0 || tweetResult.stocks.length > 0) {
        const twitterBatch = await db.video.upsert({
          where: { externalId: `twitter-batch-${new Date().toISOString().split('T')[0]}` },
          create: {
            platform: 'twitter',
            externalId: `twitter-batch-${new Date().toISOString().split('T')[0]}`,
            title: `Twitter posts — ${new Date().toLocaleDateString()}`,
            url: 'https://x.com',
            publishedAt: new Date(),
            analyzed: true,
            transcriptFetched: true,
          },
          update: { updatedAt: new Date() },
        })

        for (const item of tweetResult.news) {
          await db.newsItem.create({
            data: {
              videoId: twitterBatch.id,
              headline: item.headline,
              body: item.body,
              category: item.category,
              sentiment: item.sentiment,
              tickers: JSON.stringify(item.tickers ?? []),
              quote: item.quote ?? null,
              importance: item.importance,
              publishedAt: new Date(),
            },
          })
          newsExtracted++
        }

        for (const stock of tweetResult.stocks) {
          const quote = await getQuote(stock.ticker)
          await db.stockRecommendation.create({
            data: {
              videoId: twitterBatch.id,
              ticker: stock.ticker.toUpperCase(),
              companyName: stock.companyName,
              action: stock.action,
              confidence: stock.confidence,
              reason: stock.reason,
              quote: stock.quote ?? null,
              priceAtTime: quote?.price ?? null,
              targetPrice: stock.targetPrice ?? null,
              publishedAt: new Date(),
            },
          })
          stocksExtracted++
        }
      }
    }

    // Complete the run
    await db.agentRun.update({
      where: { id: run.id },
      data: {
        status: 'success',
        finishedAt: new Date(),
        videosFound,
        videosAnalyzed,
        newsExtracted,
        stocksExtracted,
      },
    })

    setAgentIdle()
    console.log(
      `[Agent] Done. Videos: ${videosFound}, Analyzed: ${videosAnalyzed}, News: ${newsExtracted}, Stocks: ${stocksExtracted}`
    )
  } catch (error) {
    const msg = (error as Error).message
    console.error('[Agent] Error:', msg)
    await db.agentRun.update({
      where: { id: run.id },
      data: { status: 'error', finishedAt: new Date(), errorMessage: msg },
    })
    setAgentError(msg)
  }
}
