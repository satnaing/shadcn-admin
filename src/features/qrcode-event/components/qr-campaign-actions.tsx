import { Link } from '@tanstack/react-router'
import { Gift, MoreHorizontal, Pencil, QrCode, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PermissionGuard } from '@/components/guard'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PERMISSIONS } from '@/shared/permissions'
import { CAMPAIGN_STATUSES, type CampaignListItem, type CampaignStatus } from '../data/qrcode-event.type'

interface Props {
  campaign: CampaignListItem
  onStatus: (status: CampaignStatus) => void
  onDelete: () => void
}

export function QrCampaignActions({ campaign, onStatus, onDelete }: Props) {
  const { t } = useTranslation('qrcode_event')
  const id = String(campaign.id)
  const P = PERMISSIONS.QRCODE_EVENT

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' aria-label={t('actions.more')}>
          <MoreHorizontal className='size-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <PermissionGuard permission={P.CAMPAIGNS_MANAGE}>
          <DropdownMenuItem asChild>
            <Link to='/admin/qrcode-event/campaigns/$id' params={{ id }}>
              <Pencil className='me-2 size-4' />
              {t('actions.edit')}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to='/admin/qrcode-event/campaigns/$id/prizes' params={{ id }}>
              <Gift className='me-2 size-4' />
              {t('actions.prizes')}
            </Link>
          </DropdownMenuItem>
        </PermissionGuard>
        <PermissionGuard permission={P.BATCHES_CREATE}>
          <DropdownMenuItem asChild>
            <Link to='/admin/qrcode-event/batches/new' search={{ campaign_id: id }}>
              <QrCode className='me-2 size-4' />
              {t('actions.createBatch')}
            </Link>
          </DropdownMenuItem>
        </PermissionGuard>
        <PermissionGuard permission={P.CAMPAIGNS_MANAGE}>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>{t('actions.setStatus')}</DropdownMenuLabel>
          {CAMPAIGN_STATUSES.filter((s) => s !== campaign.status).map((s) => (
            <DropdownMenuItem key={s} onSelect={() => onStatus(s)}>
              {t(`campaign.${s}`)}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem className='text-destructive' onSelect={onDelete}>
            <Trash2 className='me-2 size-4' />
            {t('actions.delete')}
          </DropdownMenuItem>
        </PermissionGuard>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
