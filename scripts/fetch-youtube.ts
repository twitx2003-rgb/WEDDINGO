import { listRecentVideos } from '../src/lib/skills/youtube'

const channelId = process.argv[2]
if (channelId) {
  process.env.MICAH_STOKES_CHANNEL_ID = channelId
}

const days = Number(process.argv[3] ?? 2)

console.log(`Fetching YouTube videos (last ${days} days)...`)
listRecentVideos(days)
  .then((videos) => {
    console.log(`\nFound ${videos.length} videos:\n`)
    for (const v of videos) {
      console.log(`[${v.publishedAt.toISOString().split('T')[0]}] ${v.title}`)
      console.log(`  ${v.url}`)
      if (v.isLive) console.log('  (LIVE)')
    }
  })
  .catch(console.error)
