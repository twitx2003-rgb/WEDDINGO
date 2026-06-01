export type AgentStatus = 'idle' | 'running' | 'error'

interface AgentState {
  status: AgentStatus
  currentRunId: string | null
  lastRunAt: Date | null
  lastError: string | null
}

const state: AgentState = {
  status: 'idle',
  currentRunId: null,
  lastRunAt: null,
  lastError: null,
}

export function getAgentState(): Readonly<AgentState> {
  return state
}

export function setAgentRunning(runId: string): void {
  state.status = 'running'
  state.currentRunId = runId
  state.lastError = null
}

export function setAgentIdle(): void {
  state.status = 'idle'
  state.lastRunAt = new Date()
}

export function setAgentError(error: string): void {
  state.status = 'error'
  state.lastError = error
  state.lastRunAt = new Date()
}
