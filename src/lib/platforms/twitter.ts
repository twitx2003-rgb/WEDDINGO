import { TwitterApi } from 'twitter-api-v2'
import { config } from '../env'

export interface Tweet {
  id: string
  text: string
  createdAt: Date
  url: string
}

export async function fetchRecentTweets(maxResults = 20): Promise<Tweet[]> {
  const [bearerToken, twitterUserId] = await Promise.all([
    config.twitterBearerToken(),
    config.twitterUserId(),
  ])

  if (!bearerToken || !twitterUserId) {
    return []
  }

  try {
    const client = new TwitterApi(bearerToken)
    const timeline = await client.v2.userTimeline(twitterUserId, {
      max_results: maxResults,
      'tweet.fields': ['created_at', 'text'],
      exclude: ['retweets', 'replies'],
    })

    return timeline.data.data?.map((tweet) => ({
      id: tweet.id,
      text: tweet.text,
      createdAt: tweet.created_at ? new Date(tweet.created_at) : new Date(),
      url: `https://x.com/i/web/status/${tweet.id}`,
    })) ?? []
  } catch (err) {
    console.warn('[Twitter] Failed to fetch tweets:', (err as Error).message)
    return []
  }
}
