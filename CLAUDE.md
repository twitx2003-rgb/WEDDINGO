# Micah Stokes Stock Market Tracker

A Next.js web app that tracks Micah Stokes across YouTube and Twitter/X, uses Claude AI to extract stock market news and recommendations, and displays them in a clean dashboard.

## Tech Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- Prisma 5 + SQLite (`prisma/dev.db`)
- node-cron (hourly agent via custom server)
- YouTube Data API v3 + youtube-transcript (no key for transcripts)
- Anthropic SDK (claude-sonnet-4-6 with prompt caching)
- yahoo-finance2 (no key required)
- TradingView lightweight-charts

## Development

```bash
npm run dev          # Start with agent scheduler
npm run db:migrate   # Apply migrations
npm run db:studio    # Prisma Studio
npm run db:generate  # Regenerate Prisma client
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in — or configure via `/settings` in the UI.

- `DATABASE_URL` — SQLite path (default: `file:./prisma/dev.db`)
- `YOUTUBE_API_KEY` — Google Cloud Console (free)
- `MICAH_STOKES_CHANNEL_ID` — YouTube channel ID (UCxxxxxxx)
- `ANTHROPIC_API_KEY` — console.anthropic.com
- `TWITTER_BEARER_TOKEN` — optional
- `AGENT_SECRET` — protects POST /api/agent/trigger

## Agent Flow

1. Fetch recent YouTube videos (YouTube Data API v3)
2. Fetch transcripts (youtube-transcript, no key)
3. Analyze with Claude → extract news items and stock picks
4. Fetch stock prices (yahoo-finance2)
5. Optional: fetch Twitter posts
6. Store everything in SQLite

## Skills (Slash Commands)

### /fetch-youtube

Manually fetch recent videos from the tracked channel.

```bash
npx tsx scripts/fetch-youtube.ts [channelId] [days]
```

### /analyze-video

Fetch transcript and run Claude analysis on a specific YouTube video.

```bash
npx tsx scripts/analyze-video.ts <videoId>
```

### /fetch-stock-price

Test the stock price skill for a specific ticker.

```bash
npx tsx scripts/fetch-stock-price.ts <TICKER>
```

### /verify-stock

Verify and analyze a stock the way the agent does: confirm the ticker exists
on Yahoo Finance (correcting wrong tickers by company-name search), flag
non-tradeable mentions (e.g. private companies), then pull live price, 30-day
history, and compute the recent trend.

```bash
npx tsx scripts/verify-stock.ts <TICKER> [companyName]
```

Skill source: `src/lib/skills/stockVerification.ts` (`verifyStock`, `analyzeStock`).
The agent calls `analyzeStock` for every extracted pick and **skips unverified
tickers** so hallucinated symbols never reach the database.

## Notes

- Instagram/TikTok cannot be tracked via API (platform restrictions).
- The Claude system prompt uses `cache_control: ephemeral` for cost efficiency.
- SQLite supports migration to PostgreSQL by changing `provider` in schema.prisma.
