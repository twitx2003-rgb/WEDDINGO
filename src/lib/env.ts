import { db } from './db'

async function getSetting(key: string): Promise<string | null> {
  try {
    const setting = await db.settings.findUnique({ where: { key } })
    return setting?.value ?? null
  } catch {
    return null
  }
}

function getEnv(key: string): string | null {
  return process.env[key] ?? null
}

async function getSettingOrEnv(key: string): Promise<string | null> {
  const fromDb = await getSetting(key)
  if (fromDb) return fromDb
  return getEnv(key)
}

export const config = {
  youtubeApiKey: () => getSettingOrEnv('YOUTUBE_API_KEY'),
  channelId: () => getSettingOrEnv('MICAH_STOKES_CHANNEL_ID'),
  anthropicApiKey: () => getSettingOrEnv('ANTHROPIC_API_KEY'),
  twitterBearerToken: () => getSettingOrEnv('TWITTER_BEARER_TOKEN'),
  twitterUserId: () => getSettingOrEnv('MICAH_STOKES_TWITTER_ID'),
  agentSecret: () => getEnv('AGENT_SECRET') ?? 'changeme123',
}

export async function getConfigStatus(): Promise<{
  youtube: boolean
  claude: boolean
  twitter: boolean
  channelId: boolean
}> {
  const [youtubeKey, channelId, anthropicKey, twitterToken] = await Promise.all([
    config.youtubeApiKey(),
    config.channelId(),
    config.anthropicApiKey(),
    config.twitterBearerToken(),
  ])
  return {
    youtube: !!youtubeKey,
    channelId: !!channelId,
    claude: !!anthropicKey,
    twitter: !!twitterToken,
  }
}
