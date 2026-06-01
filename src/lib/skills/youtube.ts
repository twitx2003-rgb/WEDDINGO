import { YoutubeTranscript } from 'youtube-transcript'
import { config } from '../env'

export interface YouTubeVideo {
  id: string
  title: string
  url: string
  publishedAt: Date
  thumbnailUrl: string | null
  isLive: boolean
  channelId: string
  description: string
}

async function resolveToChannelId(apiKey: string, value: string): Promise<string | null> {
  // Already a UC... channel ID
  if (value.startsWith('UC')) return value

  // @handle or full URL containing @handle
  const handleMatch = value.match(/@([\w.-]+)/)
  if (handleMatch) {
    const url = new URL('https://www.googleapis.com/youtube/v3/channels')
    url.searchParams.set('key', apiKey)
    url.searchParams.set('forHandle', handleMatch[1])
    url.searchParams.set('part', 'id')
    const res = await fetch(url.toString())
    if (!res.ok) return null
    const data = await res.json()
    return data.items?.[0]?.id ?? null
  }

  return value
}

export async function listRecentVideos(sinceDays = 2): Promise<YouTubeVideo[]> {
  const apiKey = await config.youtubeApiKey()
  const channelRaw = await config.channelId()

  if (!apiKey || !channelRaw) {
    console.warn('[YouTube] API key or channel ID not configured — skipping video fetch')
    return []
  }

  const channelId = await resolveToChannelId(apiKey, channelRaw)
  if (!channelId) {
    console.warn('[YouTube] Could not resolve channel ID from:', channelRaw)
    return []
  }

  const sinceDate = new Date()
  sinceDate.setDate(sinceDate.getDate() - sinceDays)
  const publishedAfter = sinceDate.toISOString()

  const videos: YouTubeVideo[] = []

  const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search')
  searchUrl.searchParams.set('key', apiKey)
  searchUrl.searchParams.set('channelId', channelId)
  searchUrl.searchParams.set('type', 'video')
  searchUrl.searchParams.set('order', 'date')
  searchUrl.searchParams.set('maxResults', '15')
  searchUrl.searchParams.set('publishedAfter', publishedAfter)
  searchUrl.searchParams.set('part', 'snippet')

  const res = await fetch(searchUrl.toString())
  if (!res.ok) {
    console.error('[YouTube] Search API error:', await res.text())
    return []
  }

  const data = await res.json()
  for (const item of data.items ?? []) {
    videos.push({
      id: item.id.videoId,
      title: item.snippet.title,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      publishedAt: new Date(item.snippet.publishedAt),
      thumbnailUrl: item.snippet.thumbnails?.medium?.url ?? null,
      isLive: item.snippet.liveBroadcastContent === 'live',
      channelId: item.snippet.channelId,
      description: item.snippet.description ?? '',
    })
  }

  return videos
}

export async function fetchTranscript(videoId: string): Promise<string | null> {
  try {
    const segments = await YoutubeTranscript.fetchTranscript(videoId)
    return segments.map((s) => s.text).join(' ')
  } catch (err) {
    console.warn(`[YouTube] No transcript for ${videoId}:`, (err as Error).message)
    return null
  }
}

export async function resolveChannelId(youtubeUrl: string): Promise<string | null> {
  const apiKey = await config.youtubeApiKey()
  if (!apiKey) return null

  // Handle channel URLs like @handle, /channel/UCxxx, /user/xxx
  const handleMatch = youtubeUrl.match(/@([\w.-]+)/)
  const channelMatch = youtubeUrl.match(/\/channel\/(UC[\w-]+)/)

  if (channelMatch) return channelMatch[1]

  if (handleMatch) {
    const handle = handleMatch[1]
    const url = new URL('https://www.googleapis.com/youtube/v3/channels')
    url.searchParams.set('key', apiKey)
    url.searchParams.set('forHandle', handle)
    url.searchParams.set('part', 'id')
    const res = await fetch(url.toString())
    if (!res.ok) return null
    const data = await res.json()
    return data.items?.[0]?.id ?? null
  }

  return null
}
