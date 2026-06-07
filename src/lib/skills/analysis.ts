import Anthropic from '@anthropic-ai/sdk'
import { config } from '../env'
import type { AnalysisResult } from '@/types'

const SYSTEM_PROMPT = `You are a financial content analyst specializing in Israeli stock market commentary.
Your task is to analyze content from Micah Stokes (מיקה סטוקס), an Israeli stock market analyst/trader
who publishes in Hebrew. You will receive video titles, descriptions, and keyword tags.

SCOPE — extract ONLY:
1. NEWS ITEMS: Direct market events — earnings reports, stock/index moves, sector trends, macro data (interest rates, inflation, GDP), company-specific news. If a topic is not directly about financial markets or publicly traded assets, do NOT include it.
2. STOCK RECOMMENDATIONS: Specific stocks or ETFs Micah explicitly mentions or analyzes.

Do NOT extract: general life advice, personal stories, channel announcements, or any content unrelated to financial markets.

CRITICAL LANGUAGE RULE:
- Write ALL free-text fields in fluent, natural Hebrew (עברית תקינה וזורמת).
- This applies to: "headline", "body", and "reason".
- Keep stock tickers in Latin letters (e.g. AAPL, TSLA, NVDA).
- "companyName" may stay in its common official form.
- The audience is Israeli — the text must read naturally in Hebrew, not translated-sounding.

Category definitions (use the most specific that fits):
- "earnings" — company earnings/results/guidance
- "market_move" — index moves, stock price action, technical analysis
- "sector" — sector rotation, industry trends
- "macro" — rates, inflation, Fed, economic data, geopolitics affecting markets
- "general" — only as last resort for clearly market-related content that fits none of the above

Other rules:
- Tags/keywords often contain stock tickers — include them as relevant stocks
- Israeli stocks: TEVA, ICL, NICE, CHKP; US stocks: AAPL, TSLA, NVDA
- SpaceX = private company — note as "watch" with no ticker
- When in doubt about a stock action, use "watch"
- If the video is market-related, return at least 1 news item

Respond with valid JSON only in this exact format:
{
  "news": [
    {
      "headline": "כותרת תמציתית בעברית עד 100 תווים",
      "body": "סיכום של 2-3 משפטים בעברית",
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
      "reason": "הסבר קצר בעברית מדוע המניה מעניינת",
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
