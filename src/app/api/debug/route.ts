import { NextResponse } from 'next/server'
import { config } from '@/lib/env'

export async function GET() {
  const apiKey = await config.youtubeApiKey()
  const channelRaw = await config.channelId()
  const anthropicKey = await config.anthropicApiKey()

  const result: Record<string, unknown> = {
    hasYoutubeKey: !!apiKey,
    hasChannelId: !!channelRaw,
    channelIdValue: channelRaw,
    hasAnthropicKey: !!anthropicKey,
  }

  if (!apiKey || !channelRaw) {
    return NextResponse.json({ ...result, error: 'Missing config' })
  }

  // Test YouTube channel resolution
  try {
    const handleMatch = channelRaw.match(/@([\w.-]+)/)
    let channelId: string | null = null

    if (channelRaw.startsWith('UC')) {
      channelId = channelRaw
    } else if (handleMatch) {
      const url = new URL('https://www.googleapis.com/youtube/v3/channels')
      url.searchParams.set('key', apiKey)
      url.searchParams.set('forHandle', handleMatch[1])
      url.searchParams.set('part', 'id,snippet')
      const res = await fetch(url.toString())
      const data = await res.json()
      result.youtubeApiStatus = res.status
      result.youtubeApiResponse = data
      channelId = data.items?.[0]?.id ?? null
    }

    result.resolvedChannelId = channelId

    if (channelId) {
      // Try fetching 1 recent video
      const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search')
      searchUrl.searchParams.set('key', apiKey)
      searchUrl.searchParams.set('channelId', channelId)
      searchUrl.searchParams.set('type', 'video')
      searchUrl.searchParams.set('order', 'date')
      searchUrl.searchParams.set('maxResults', '3')
      searchUrl.searchParams.set('part', 'snippet')
      const searchRes = await fetch(searchUrl.toString())
      const searchData = await searchRes.json()
      result.searchStatus = searchRes.status
      result.recentVideos = searchData.items?.map((i: { id: { videoId: string }; snippet: { title: string; publishedAt: string } }) => ({
        id: i.id.videoId,
        title: i.snippet.title,
        publishedAt: i.snippet.publishedAt,
      }))
      result.totalResults = searchData.pageInfo?.totalResults
    }
  } catch (e) {
    result.error = (e as Error).message
  }

  return NextResponse.json(result)
}
