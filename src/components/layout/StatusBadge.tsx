'use client'

import { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Activity, AlertCircle, Clock } from 'lucide-react'

interface StatusData {
  agentStatus: string
  lastRun?: {
    finishedAt?: string
    status: string
  }
}

export function StatusBadge() {
  const [status, setStatus] = useState<StatusData | null>(null)

  useEffect(() => {
    const fetchStatus = async () => {
      const res = await fetch('/api/status')
      if (res.ok) setStatus(await res.json())
    }
    fetchStatus()
    const interval = setInterval(fetchStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  if (!status) return null

  const isRunning = status.agentStatus === 'running'
  const lastFinished = status.lastRun?.finishedAt

  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-400">
      {isRunning ? (
        <>
          <Activity className="h-3 w-3 text-blue-400 animate-pulse" />
          <span className="text-blue-400">Agent running...</span>
        </>
      ) : status.lastRun?.status === 'error' ? (
        <>
          <AlertCircle className="h-3 w-3 text-red-400" />
          <span className="text-red-400">Agent error</span>
        </>
      ) : (
        <>
          <Clock className="h-3 w-3" />
          <span>
            {lastFinished
              ? `Updated ${formatDistanceToNow(new Date(lastFinished), { addSuffix: true })}`
              : 'Not yet run'}
          </span>
        </>
      )}
    </div>
  )
}
