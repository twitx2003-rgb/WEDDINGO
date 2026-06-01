import cron from 'node-cron'
import { runAgent } from './index'
import { getAgentState } from './state'

let initialized = false

export function initScheduler(): void {
  if (initialized) return
  initialized = true

  console.log('[Scheduler] Initializing hourly agent schedule...')

  // Run every hour at minute 0
  cron.schedule('0 * * * *', async () => {
    const state = getAgentState()
    if (state.status === 'running') {
      console.log('[Scheduler] Agent already running, skipping this tick')
      return
    }
    await runAgent()
  })

  console.log('[Scheduler] Agent will run every hour. Running initial check in 5 seconds...')
  setTimeout(async () => {
    const state = getAgentState()
    if (state.status === 'idle') {
      await runAgent()
    }
  }, 5000)
}
