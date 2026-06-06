import Anthropic from '@anthropic-ai/sdk'
import { config } from '../env'
import type { AnalysisResult } from '@/types'

const SYSTEM_PROMPT = `You are a financial content analyst specializing in Israeli stock market commentary.
Your task is to analyze content from Micah Stokes (מיקה סטוקס), an Israeli stock market analyst/trader
who publishes in Hebrew. You will receive video titles, descriptions, and keyword tags.

Even when the content is brief (short description or just tags), do your best to extract:
1. NEWS ITEMS: Market events, stock moves, sector commentary, earnings, macro topics
2. STOCK RECOMMENDATIONS: Any stocks or companies he specifically mentions

Important rules:
- The video title alone is enough to create a news item summarizing the topic
- Tags/keywords often contain stock tickers — include them as relevant stocks
- Content is in Hebrew — translate and interpret accordingly
- Israeli stocks use tickers like TEVA, ICL, NICE, CHKP; US stocks like AAPL, TSLA, NVDA
- SpaceX (ספייס אקס) = private, not publicly traded — note as "watch" with no ticker
- When in doubt about a stock mentioned, include it as "watch" action
- Always return at least 1 news item based on the video title and date if any content exists

Respond with valid JSON only in this exact format:
{
  "news": [
    {
      "headline": "Brief headline max 100 chars",
      "body": "2-3 sentence summary",
      "category": "earnings|market_move|sector|macro|general",
      "sentiment": "bullish|bearish|neutral",
      "tickers": ["AAPL", "TSLA"],
      "quote": null,
      "importance": 7
    }
  ],
  "stocks": [
    {
      "ticker": "AAPL",
      "companyName": "Apple Inc.",
      "action": "buy|watch|sell|avoid",
      "confidence": 6,
      "reason": "brief explanation",
      "quote": null,
      "targetPrice": null
    }
  ]
}`

let client: Anthropic | null = null

function getClient(apiKey: string): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey })
  }
  return client
}

export async function analyzeTranscript(
  videoTitle: string,
  publishedAt: Date,
  transcript: string
): Promise<AnalysisResult> {
  const apiKey = await config.anthropicApiKey()
  if (!apiKey) {
    console.warn('[Analysis] Anthropic API key not configured — skipping analysis')
    return { news: [], stocks: [] }
  }

  const anthropic = getClient(apiKey)

  const truncatedTranscript = transcript.slice(0, 40000)

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: [
      {
        type: 'text',
        text: SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [
      {
        role: 'user',
        content: `Video Title: ${videoTitle}
Published: ${publishedAt.toISOString()}

Transcript:
${truncatedTranscript}

Extract news items and stock recommendations from this transcript. Return only JSON.`,
      },
    ],
  })

  const rawText = message.content[0].type === 'text' ? message.content[0].text : ''

  try {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found in response')
    const result = JSON.parse(jsonMatch[0]) as AnalysisResult
    return {
      news: result.news ?? [],
      stocks: result.stocks ?? [],
    }
  } catch (err) {
    console.error('[Analysis] Failed to parse Claude response:', err)
    return { news: [], stocks: [] }
  }
}
