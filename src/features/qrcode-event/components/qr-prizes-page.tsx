import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Button } from '@/components/ui/button'
import type { PrizeItem } from '../data/qrcode-event.type'
import { useQrCampaign, useQrPrizes } from '../hooks/use-qrcode-event'
import { useQrMutations } from '../hooks/use-qrcode-event-mutations'
import { QrPrizeDialog } from './qr-prize-dialog'
import { QrPrizesTable } from './qr-prizes-table'

/** `editing`: `0` = creating, a prize = editing, `null` = closed. */
export function QrPrizesPage({ campaignId }: { campaignId: string }) {
  const { t } = useTranslation('qrcode_event')
  const [editing, setEditing] = useState<PrizeItem | 0 | null>(null)
  const [target, setTarget] = useState<PrizeItem | null>(null)
  const { data: campaign } = useQrCampaign(campaignId)
  const { data } = useQrPrizes(campaignId)
  const { removePrize } = useQrMutations()

  return (
    <AdminPageShell
      title={t('prizes.title', { name: campaign?.data.name ?? '' })}
      description={t('prizes.description')}
      actions={
        <div className='flex gap-2'>
          <Button asChild variant='outline'>
            <Link to='/admin/qrcode-event/campaigns'>
              <ArrowLeft className='me-2 size-4' />
              {t('actions.back')}
            </Link>
          </Button>
          <Button onClick={() => setEditing(0)}>
            <Plus className='me-2 size-4' />
            {t('prizes.new')}
          </Button>
        </div>
      }
    >
      <QrPrizesTable prizes={data?.data ?? []} onEdit={setEditing} onDelete={setTarget} />
      {editing !== null && (
        <QrPrizeDialog
          key={editing === 0 ? 'new' : editing.id}
          open
          onOpenChange={(open) => !open && setEditing(null)}
          campaignId={campaignId}
          prize={editing || undefined}
        />
      )}
      <ConfirmDialog
        open={!!target}
        onOpenChange={(open) => !open && setTarget(null)}
        title={t('prizes.deleteTitle')}
        desc={t('prizes.deleteDesc', { title: target?.title })}
        confirmText={t('actions.delete')}
        destructive
        isLoading={removePrize.isPending}
        handleConfirm={() => target && removePrize.mutate(target.id, { onSettled: () => setTarget(null) })}
      />
    </AdminPageShell>
  )
}
