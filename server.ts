import { createServer } from 'http'
import { parse } from 'url'
import { execSync } from 'child_process'
import next from 'next'
import { initScheduler } from './src/lib/agent/scheduler'

const dev = process.env.NODE_ENV !== 'production'
const port = parseInt(process.env.PORT ?? '3000', 10)

// Sync database schema on startup (creates tables if they don't exist)
try {
  console.log('> Syncing database schema...')
  execSync('npx prisma db push --skip-generate', { stdio: 'inherit' })
} catch (e) {
  console.warn('> DB sync warning:', e)
}

const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    handle(req, res, parsedUrl)
  }).listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
    initScheduler()
  })
})
