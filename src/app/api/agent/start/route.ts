import { NextResponse } from 'next/server'
import { runAgent } from '@/lib/agent'
import { getAgentState } from '@/lib/agent/state'

export async function POST() {
  const state = getAgentState()
  if (state.status === 'running') {
    return NextResponse.json({ error: 'Agent already running', runId: state.currentRunId }, { status: 409 })
  }

  runAgent().catch(console.error)

  return NextResponse.json({ ok: true, message: 'Agent triggered' })
}
