import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, Gift, Power } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { PermissionGuard } from '@/components/guard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PERMISSIONS } from '@/shared/permissions'
import { useQrCode } from '../hooks/use-qrcode-event'
import { useQrMutations } from '../hooks/use-qrcode-event-mutations'
import { QrBadge } from './qr-badge'
import { QrClaimDialog } from './qr-claim-dialog'
import { QrCodeChecks } from './qr-code-checks'

export function QrCodeDetailPage({ id }: { id: string }) {
  const { t } = useTranslation('qrcode_event')
  const [claiming, setClaiming] = useState(false)
  const { data } = useQrCode(id)
  const { toggleCode } = useQrMutations()
  const code = data?.data
  if (!code) return <div className='p-6' aria-busy='true' />

  const rows: [string, string | null][] = [
    [t('codes.columns.campaign'), code.campaign_name],
    [t('codes.columns.prize'), code.prize_title],
    [t('codes.columns.user'), code.user_name],
    [t('codes.columns.checkedAt'), code.checked_at?.slice(0, 16).replace('T', ' ') ?? null],
    [t('codes.detail.claimedAt'), code.claimed_at?.slice(0, 16).replace('T', ' ') ?? null],
    [t('codes.detail.claimedBy'), code.claimed_by_name],
    [t('codes.detail.claimNote'), code.claim_note || null],
    [t('logs.columns.ip'), code.ip],
  ]

  return (
    <AdminPageShell
      title={code.code}
      description={t('codes.detail.description')}
      actions={
        <div className='flex gap-2'>
          <Button asChild variant='outline'>
            <Link to='/admin/qrcode-event/codes'>
              <ArrowLeft className='me-2 size-4' />
              {t('actions.back')}
            </Link>
          </Button>
          <PermissionGuard permission={PERMISSIONS.QRCODE_EVENT.CODES_MANAGE}>
            <Button variant='outline' onClick={() => toggleCode.mutate(code.id)}>
              <Power className='me-2 size-4' />
              {t(code.status === 'disabled' ? 'codes.enable' : 'codes.disable')}
            </Button>
            {code.prize_id !== null && code.status === 'checked' && (
              <Button onClick={() => setClaiming(true)}>
                <Gift className='me-2 size-4' />
                {t('codes.claim.title')}
              </Button>
            )}
          </PermissionGuard>
        </div>
      }
    >
      <Card>
        <CardContent className='grid gap-3 sm:grid-cols-2'>
          <div className='flex items-center gap-2'>
            <span className='text-sm text-muted-foreground'>{t('codes.columns.status')}</span>
            <QrBadge group='code' value={code.status} />
          </div>
          {rows.map(([label, value]) => (
            <div key={label} className='flex gap-2 text-sm'>
              <span className='text-muted-foreground'>{label}</span>
              <span className='font-medium'>{value ?? '—'}</span>
            </div>
          ))}
        </CardContent>
      </Card>
      <QrCodeChecks checks={code.checks} />
      {claiming && <QrClaimDialog open onOpenChange={setClaiming} codeId={code.id} />}
    </AdminPageShell>
  )
}
