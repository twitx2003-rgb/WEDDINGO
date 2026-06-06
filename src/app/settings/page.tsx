'use client'

import { useState, useEffect, useCallback } from 'react'
import { Settings } from 'lucide-react'
import { SetupChecklist } from '@/components/settings/SetupChecklist'
import { ApiKeyForm } from '@/components/settings/ApiKeyForm'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'

interface ConfigStatus {
  youtube: boolean
  channelId: boolean
  claude: boolean
  twitter: boolean
}

export default function SettingsPage() {
  const [status, setStatus] = useState<ConfigStatus | null>(null)

  const refresh = useCallback(async () => {
    const res = await fetch('/api/settings')
    if (res.ok) {
      const data = await res.json()
      setStatus(data.status)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-gray-700/50 p-2.5">
          <Settings className="h-6 w-6 text-gray-300" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">הגדרות</h1>
          <p className="text-sm text-gray-400">הגדרת מפתחות API והתנהגות הסוכן</p>
        </div>
      </div>

      {status && (
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-white">סטטוס חיבורים</h2>
          </CardHeader>
          <CardBody>
            <SetupChecklist status={status} />
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-white">מפתחות API</h2>
          <p className="text-xs text-gray-400 mt-0.5">המפתחות נשמרים באופן מאובטח במסד הנתונים</p>
        </CardHeader>
        <CardBody>
          <ApiKeyForm onSaved={refresh} />
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h3 className="font-medium text-white mb-2">אודות הסוכן</h3>
          <ul className="space-y-1.5 text-sm text-gray-400">
            <li>• רץ אוטומטית כל שעה (דרך GitHub Actions, 24/7)</li>
            <li>• סורק את יוטיוב לסרטונים חדשים ושידורים חוזרים של מיקה סטוקס</li>
            <li>• משתמש בבינה מלאכותית Claude לחילוץ חדשות שוק והמלצות מניות</li>
            <li>• מאמת כל טיקר ומושך מחירים חיים מ-Yahoo Finance (ללא צורך במפתח)</li>
            <li>• אינסטגרם וטיקטוק לא ניתנים למעקב עקב הגבלות API</li>
          </ul>
        </CardBody>
      </Card>
    </div>
  )
}
