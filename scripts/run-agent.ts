import { runAgent } from '../src/lib/agent'

runAgent()
  .then(() => {
    console.log('[Agent] Completed successfully')
    process.exit(0)
  })
  .catch((err) => {
    console.error('[Agent] Fatal error:', err)
    process.exit(1)
  })
