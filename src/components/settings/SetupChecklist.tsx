import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface ConfigStatus {
  youtube: boolean
  channelId: boolean
  claude: boolean
  twitter: boolean
}

export function SetupChecklist({ status }: { status: ConfigStatus }) {
  const items = [
    {
      label: 'YouTube Data API Key',
      description: 'Required to fetch videos and lives',
      ok: status.youtube,
      required: true,
      link: 'https://console.cloud.google.com/apis/library/youtube.googleapis.com',
      linkLabel: 'Google Cloud Console',
    },
    {
      label: 'Micah Stokes Channel ID',
      description: 'The YouTube channel to track',
      ok: status.channelId,
      required: true,
    },
    {
      label: 'Claude / Anthropic API Key',
      description: 'Required for AI analysis of transcripts',
      ok: status.claude,
      required: true,
      link: 'https://console.anthropic.com/',
      linkLabel: 'Anthropic Console',
    },
    {
      label: 'Twitter/X Bearer Token',
      description: 'Optional — tracks tweets by Micah',
      ok: status.twitter,
      required: false,
      link: 'https://developer.twitter.com/en/portal/dashboard',
      linkLabel: 'Twitter Developer Portal',
    },
  ]

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-3"
        >
          {item.ok ? (
            <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 shrink-0" />
          ) : item.required ? (
            <XCircle className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">{item.label}</span>
              {!item.required && (
                <span className="text-xs text-gray-500 bg-white/10 px-1.5 py-0.5 rounded">
                  optional
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
            {item.link && !item.ok && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 underline mt-1 inline-block"
              >
                Get key from {item.linkLabel} →
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
