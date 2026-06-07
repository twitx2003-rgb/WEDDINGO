import { NextResponse } from 'next/server'
import { runAgent } from '@/lib/agent'
import { db } from '@/lib/db'

export const maxDuration = 60

export async function POST() {
  // Check DB for a currently running agent (in-memory state doesn't work on serverless)
  const running = await db.agentRun.findFirst({
    where: { status: 'running' },
    orderBy: { startedAt: 'desc' },
  })

  if (running) {
    const ageSeconds = (Date.now() - running.startedAt.getTime()) / 1000
    // If stuck for more than 5 minutes, assume it died and allow a new run
    if (ageSeconds < 300) {
      return NextResponse.json({ error: 'Agent already running' }, { status: 409 })
    }
  }

  // Vercel has a 60-second limit — analyze at most 2 videos per manual trigger.
  // The hourly GitHub Actions job handles the full backlog (up to 50 videos).
  await runAgent(2)

  return NextResponse.json({ ok: true, message: 'Agent completed' })
}
