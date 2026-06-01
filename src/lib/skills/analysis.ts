import Anthropic from '@anthropic-ai/sdk'
import { config } from '../env'
import type { AnalysisResult } from '@/types'

const SYSTEM_PROMPT = `You are a financial content analyst specializing in stock market commentary.
Your task is to analyze video transcripts from Micah Stokes, a stock market analyst/trader,
and extract two types of structured information:

1. NEWS ITEMS: Market news, updates, sector commentary, earnings notes, macro commentary
2. STOCK RECOMMENDATIONS: Specific stocks he mentions as interesting or recommends for investment

For news items, always extract the most important and actionable updates.
For stock recommendations, only include stocks he specifically discusses as investment opportunities,
not just brief mentions. Focus on quality over quantity — only the best picks.

Respond with valid JSON only in this exact format:
{
  "news": [
    {
      "headline": "Brief headline max 100 chars",
      "body": "2-3 sentence summary of the news/update",
      "category": "earnings|market_move|sector|macro|general",
      "sentiment": "bullish|bearish|neutral",
      "tickers": ["AAPL", "TSLA"],
      "quote": "verbatim quote from transcript if available",
      "importance": 7
    }
  ],
  "stocks": [
    {
      "ticker": "AAPL",
      "companyName": "Apple Inc.",
      "action": "buy|watch|sell|avoid",
      "confidence": 8,
      "reason": "brief explanation of why this stock is interesting",
      "quote": "verbatim quote from transcript",
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
