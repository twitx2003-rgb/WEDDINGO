import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getConfigStatus } from '@/lib/env'

export async function GET() {
  const status = await getConfigStatus()
  const settings = await db.settings.findMany()

  const masked: Record<string, string> = {}
  for (const s of settings) {
    if (s.key.includes('KEY') || s.key.includes('TOKEN') || s.key.includes('SECRET')) {
      masked[s.key] = s.value.length > 4 ? '****' + s.value.slice(-4) : '****'
    } else {
      masked[s.key] = s.value
    }
  }

  return NextResponse.json({ settings: masked, status })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const allowedKeys = [
    'YOUTUBE_API_KEY',
    'MICAH_STOKES_CHANNEL_ID',
    'ANTHROPIC_API_KEY',
    'TWITTER_BEARER_TOKEN',
    'MICAH_STOKES_TWITTER_ID',
  ]

  for (const [key, value] of Object.entries(body)) {
    if (!allowedKeys.includes(key)) continue
    if (typeof value !== 'string') continue

    if (value === '') {
      await db.settings.deleteMany({ where: { key } })
    } else {
      await db.settings.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      })
    }
  }

  const status = await getConfigStatus()
  return NextResponse.json({ ok: true, status })
}
