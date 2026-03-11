import { formatDistanceToNow } from 'date-fns'
import { Laptop, Smartphone, MapPin, Clock, LogOut, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ContentSection } from '../components/content-section'
import { useSessions, useRevokeSession } from '@/hooks/queries/use-auth'
import { type StaffSession } from '@/types/api'

function parseDevice(
  userAgent: string | null,
  deviceName: string | null,
  overrideBrowser?: string
) {
  if (deviceName) return { label: deviceName, isMobile: false }
  if (!userAgent) return { label: 'Unknown Browser', isMobile: false }

  const ua = userAgent

  // OS detection
  let os = ''
  if (/Windows NT/.test(ua)) os = 'Windows'
  else if (/Mac OS X/.test(ua) && !/iPhone|iPad/.test(ua)) os = 'macOS'
  else if (/iPhone/.test(ua)) os = 'iPhone'
  else if (/iPad/.test(ua)) os = 'iPad'
  else if (/Android/.test(ua)) os = 'Android'
  else if (/Linux/.test(ua)) os = 'Linux'

  // Browser detection — overrideBrowser used for current device (e.g. Brave)
  let browser = overrideBrowser ?? ''
  if (!browser) {
    if (/Edg\//.test(ua)) browser = 'Edge'
    else if (/OPR\/|Opera/.test(ua)) browser = 'Opera'
    else if (/Chrome\//.test(ua)) browser = 'Chrome'
    else if (/Firefox\//.test(ua)) browser = 'Firefox'
    else if (/Safari\//.test(ua)) browser = 'Safari'
  }

  const isMobile = /iPhone|iPad|Android/.test(ua)
  const label = [browser, os].filter(Boolean).join(' on ') || 'Unknown Browser'
  return { label, isMobile }
}

// Detects the actual browser running on this device (client-side only)
function detectCurrentBrowser(): string | undefined {
  if (typeof navigator === 'undefined') return undefined
  if ('brave' in navigator) return 'Brave'
  return undefined
}

function SessionCard({
  session,
  isCurrent,
  onRevoke,
  isRevoking,
}: {
  session: StaffSession
  isCurrent: boolean
  onRevoke: (id: string) => void
  isRevoking: boolean
}) {
  const overrideBrowser = isCurrent ? detectCurrentBrowser() : undefined
  const { label, isMobile } = parseDevice(session.userAgent ?? null, session.deviceName, overrideBrowser)
  const lastActive = formatDistanceToNow(new Date(session.lastActiveAt), { addSuffix: true })
  const signedIn = formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })

  return (
    <div className={`flex items-start justify-between rounded-lg border p-4 ${isCurrent ? 'bg-muted/40' : ''}`}>
      <div className='flex gap-3'>
        <div className='mt-0.5 rounded-md border p-2'>
          {isMobile
            ? <Smartphone className='h-4 w-4 text-muted-foreground' />
            : <Laptop className='h-4 w-4 text-muted-foreground' />
          }
        </div>
        <div className='space-y-1'>
          <div className='flex items-center gap-2'>
            <p className='text-sm font-medium leading-none'>{label}</p>
            {isCurrent && (
              <Badge variant='secondary' className='h-4 px-1.5 text-[10px]'>
                This device
              </Badge>
            )}
          </div>
          {session.ipAddress && (
            <p className='flex items-center gap-1 text-xs text-muted-foreground'>
              <MapPin className='h-3 w-3' />
              {session.ipAddress}
            </p>
          )}
          <p className='flex items-center gap-1 text-xs text-muted-foreground'>
            <Clock className='h-3 w-3' />
            {isCurrent ? 'Currently active' : `Active ${lastActive}`}
            &nbsp;&middot;&nbsp;Signed in {signedIn}
          </p>
        </div>
      </div>
      {!isCurrent && (
        <Button
          variant='ghost'
          size='sm'
          className='text-destructive hover:text-destructive'
          onClick={() => onRevoke(session.id)}
          disabled={isRevoking}
        >
          {isRevoking
            ? <Loader2 className='h-4 w-4 animate-spin' />
            : <LogOut className='h-4 w-4' />
          }
          <span className='ml-1'>Revoke</span>
        </Button>
      )}
    </div>
  )
}

function SessionsList() {
  const { data: sessions, isLoading } = useSessions()
  const { mutate: revoke, isPending, variables } = useRevokeSession()
  const currentSessionId = localStorage.getItem('currentSessionId')

  if (isLoading) {
    return (
      <div className='space-y-3'>
        <Skeleton className='h-[72px] w-full rounded-lg' />
        <Skeleton className='h-[72px] w-full rounded-lg' />
        <Skeleton className='h-[72px] w-full rounded-lg' />
      </div>
    )
  }

  if (!sessions || sessions.length === 0) {
    return <p className='text-sm text-muted-foreground'>No active sessions found.</p>
  }

  // Current session first, others after
  const sorted = [...sessions].sort((a, b) =>
    a.id === currentSessionId ? -1 : b.id === currentSessionId ? 1 : 0
  )

  return (
    <div className='space-y-3'>
      <p className='text-sm text-muted-foreground'>
        {sessions.length} active session{sessions.length !== 1 ? 's' : ''}
      </p>
      {sorted.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          isCurrent={session.id === currentSessionId}
          onRevoke={revoke}
          isRevoking={isPending && variables === session.id}
        />
      ))}
    </div>
  )
}

export function SettingsSessions() {
  return (
    <ContentSection
      title='Active Sessions'
      desc='Manage devices that are currently signed in to your account. Revoke any session you do not recognize.'
    >
      <SessionsList />
    </ContentSection>
  )
}
