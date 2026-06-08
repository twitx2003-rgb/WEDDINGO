import Anthropic from '@anthropic-ai/sdk'
import { config } from '../env'
import type { AnalysisResult } from '@/types'

const SYSTEM_PROMPT = `You are extracting investment insights from Micah Stokes (מיקה סטוקס), an Israeli stock trader who speaks directly and specifically to his audience.

YOUR JOB: Pull out his EXACT claims — not summaries. If he says "NVDA שברה $130 ועכשיו יעד $150", write that. If he says "קניתי AAPL ב-$180 עם סטופ $170", write that. The user reads your output INSTEAD of watching the video — make it feel like Micah is speaking.

SPECIFICITY RULES (most important):
- Headlines must include SPECIFIC details: stock names, prices, % figures, levels. Never write "תנועה חיובית בשוק" — write "S&P500 עלה 1.2% — מה שמיקה רואה הבא"
- Body must include: exact numbers, levels, targets, stop-losses, or earnings figures mentioned
- If Micah gives a specific level (תמיכה, התנגדות, יעד) — include the price
- If there's an earnings result — include the actual EPS or revenue beat/miss
- Use Micah's own Hebrew phrasing when it appears in the description (e.g. "הסימנים שהראו", "התיק מדמם", "שיניתי את דעתי")
- "reason" for stocks must explain WHY specifically — not "מניה מעניינת" but "שברה התנגדות ב-$X, יעד $Y, עצר על $Z"

LANGUAGE: All free-text fields in natural Hebrew. Tickers in Latin. Sound like Micah talks — direct, personal, Israeli market trader voice.

SCOPE: Market news and stocks ONLY. Ignore: channel promotion, disclaimers, social links, generic advice.

CATEGORIES:
- "earnings" — company results, EPS, revenue, guidance
- "market_move" — index/stock price action, technical levels, breakouts
- "sector" — sector rotation, industry-specific moves
- "macro" — Fed/interest rates, inflation, economic data, geopolitics

Return at least 1 news item if ANY market content exists.

JSON format:
{
  "news": [
    {
      "headline": "מיקה: CRWD ו-AVGO מדווחות — תוצאות מעל הציפיות, מניות מזנקות 8%",
      "body": "קראודסטרייק דיווחה על רווח של $0.93 למניה מול $0.86 צפוי. ברודקום עם הכנסות של $14.9B. מיקה: 'שתיהן עברו את הרמות שחיכיתי להן — אני בפנים'.",
      "category": "earnings",
      "sentiment": "bullish",
      "tickers": ["CRWD", "AVGO"],
      "quote": "שתיהן עברו את הרמות שחיכיתי להן — אני בפנים",
      "importance": 9
    }
  ],
  "stocks": [
    {
      "ticker": "CRWD",
      "companyName": "CrowdStrike",
      "action": "buy",
      "confidence": 8,
      "reason": "עברה $340 בדוחות — מיקה מחזיק עם יעד $380, סטופ $320",
      "quote": "זה הבריקאאוט שחיכיתי לו",
      "targetPrice": 380
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
        content: `Video Title (Micah's exact words — use this as the main angle): ${videoTitle}
Published: ${publishedAt.toISOString().split('T')[0]}

Content (description + tags):
${truncatedTranscript}

Extract Micah's specific claims, levels, and stock calls. Capture his exact language. Return only JSON.`,
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
