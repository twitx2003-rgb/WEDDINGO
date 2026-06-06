'use client'

import { useState } from 'react'
import { Eye, EyeOff, Save, Play, CheckCircle, AlertCircle } from 'lucide-react'

interface FieldConfig {
  key: string
  label: string
  placeholder: string
  hint?: string
}

const fields: FieldConfig[] = [
  {
    key: 'YOUTUBE_API_KEY',
    label: 'מפתח YouTube Data API v3',
    placeholder: 'AIzaSy...',
    hint: 'מתוך Google Cloud Console ← APIs & Services ← Credentials',
  },
  {
    key: 'MICAH_STOKES_CHANNEL_ID',
    label: 'מזהה ערוץ מיקה סטוקס',
    placeholder: 'UCxxxxxxxxxxxxxxxx או הדבק כתובת יוטיוב',
    hint: 'הדבק את כתובת הערוץ המלאה ואנחנו נחלץ את המזהה',
  },
  {
    key: 'ANTHROPIC_API_KEY',
    label: 'מפתח Anthropic / Claude API',
    placeholder: 'sk-ant-...',
    hint: 'מתוך console.anthropic.com ← API Keys',
  },
  {
    key: 'TWITTER_BEARER_TOKEN',
    label: 'Twitter/X Bearer Token (אופציונלי)',
    placeholder: 'AAAA...',
    hint: 'מתוך developer.twitter.com ← האפליקציה שלך ← Keys and Tokens',
  },
  {
    key: 'MICAH_STOKES_TWITTER_ID',
    label: 'מזהה משתמש Twitter של מיקה (אופציונלי)',
    placeholder: '12345678',
    hint: 'מזהה משתמש מספרי (לא השם). אפשר למצוא ב-tweeterid.com',
  },
]

export function ApiKeyForm({ onSaved }: { onSaved: () => void }) {
  const [values, setValues] = useState<Record<string, string>>({})
  const [visible, setVisible] = useState<Record<string, boolean>>({})
  const [saving, setSaving] = useState(false)
  const [triggering, setTriggering] = useState(false)
  const [saveState, setSaveState] = useState<'idle' | 'success' | 'error'>('idle')
  const [triggerState, setTriggerState] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSave = async () => {
    setSaving(true)
    setSaveState('idle')
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (res.ok) {
        setSaveState('success')
        onSaved()
        setTimeout(() => setSaveState('idle'), 3000)
      } else {
        setSaveState('error')
      }
    } catch {
      setSaveState('error')
    } finally {
      setSaving(false)
    }
  }

  const handleTrigger = async () => {
    setTriggering(true)
    setTriggerState('idle')
    try {
      const res = await fetch('/api/agent/start', {
        method: 'POST',
      })
      if (res.ok) {
        setTriggerState('success')
        setTimeout(() => setTriggerState('idle'), 5000)
      } else {
        setTriggerState('error')
      }
    } catch {
      setTriggerState('error')
    } finally {
      setTriggering(false)
    }
  }

  return (
    <div className="space-y-5">
      {fields.map((field) => (
        <div key={field.key}>
          <label className="block text-sm font-medium text-gray-200 mb-1.5">
            {field.label}
          </label>
          <div className="relative">
            <input
              type={visible[field.key] ? 'text' : 'password'}
              placeholder={field.placeholder}
              value={values[field.key] ?? ''}
              onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 pr-10 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30"
            />
            <button
              type="button"
              onClick={() => setVisible((v) => ({ ...v, [field.key]: !v[field.key] }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              {visible[field.key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {field.hint && <p className="mt-1 text-xs text-gray-500">{field.hint}</p>}
        </div>
      ))}

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-60 transition-colors"
        >
          {saveState === 'success' ? (
            <CheckCircle className="h-4 w-4 text-green-300" />
          ) : saveState === 'error' ? (
            <AlertCircle className="h-4 w-4 text-red-300" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? 'שומר...' : saveState === 'success' ? 'נשמר!' : 'שמור הגדרות'}
        </button>

        <button
          onClick={handleTrigger}
          disabled={triggering}
          className="flex items-center gap-2 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-600 disabled:opacity-60 transition-colors"
        >
          {triggerState === 'success' ? (
            <CheckCircle className="h-4 w-4 text-green-300" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          {triggering
            ? 'מפעיל...'
            : triggerState === 'success'
              ? 'הסוכן פועל!'
              : 'הפעל סוכן עכשיו'}
        </button>
      </div>

      <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 p-3 text-xs text-orange-300 space-y-1">
        <p className="font-medium">אינסטגרם וטיקטוק</p>
        <p className="text-orange-400/80">
          הפלטפורמות האלו מגבילות גישת API של צד שלישי ולא ניתנות למעקב אוטומטי.
          יוטיוב ו-Twitter/X נתמכים במלואם.
        </p>
      </div>

      {/* GitHub Actions hourly cron */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
        <p className="text-sm font-semibold text-white">GitHub Actions — הרצה שעתית</p>
        <p className="text-xs text-gray-400 leading-relaxed">
          כדי שהסוכן ירוץ אוטומטית כל שעה (גם כשהאתר לא פעיל), הוסף את 4 ה-secrets האלו
          למאגר ה-GitHub שלך:
        </p>
        <div className="space-y-1.5 font-mono text-xs">
          {[
            { name: 'DATABASE_URL', hint: 'Vercel → Storage → neon-cinnabar-lamp → .env.local' },
            { name: 'YOUTUBE_API_KEY', hint: 'Google Cloud Console → Credentials' },
            { name: 'MICAH_STOKES_CHANNEL_ID', hint: '@Micha.Stocks or UCxxxxxxx' },
            { name: 'ANTHROPIC_API_KEY', hint: 'console.anthropic.com' },
          ].map(({ name, hint }) => (
            <div key={name} className="flex items-start gap-2">
              <span className="text-emerald-400 shrink-0">{name}</span>
              <span className="text-gray-600">— {hint}</span>
            </div>
          ))}
        </div>
        <a
          href="https://github.com/twitx2003-rgb/weddingo/settings/secrets/actions/new"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          פתח את GitHub Secrets ←
        </a>
      </div>
    </div>
  )
}
