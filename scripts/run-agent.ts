import { runAgent } from '../src/lib/agent'

// GitHub Actions has a 10-minute limit — process all pending videos in one run
runAgent(20)
  .then(() => {
    console.log('[Agent] Completed successfully')
    process.exit(0)
  })
  .catch((err) => {
    console.error('[Agent] Fatal error:', err)
    process.exit(1)
  })
