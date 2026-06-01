import { NextRequest, NextResponse } from 'next/server'
import { runAgent } from '@/lib/agent'
import { getAgentState } from '@/lib/agent/state'
import { config } from '@/lib/env'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('authorization')?.replace('Bearer ', '')
  const expectedSecret = config.agentSecret()

  if (secret !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const state = getAgentState()
  if (state.status === 'running') {
    return NextResponse.json({ error: 'Agent already running', runId: state.currentRunId }, { status: 409 })
  }

  // Run async — don't await
  runAgent().catch(console.error)

  return NextResponse.json({ ok: true, message: 'Agent triggered' })
}
