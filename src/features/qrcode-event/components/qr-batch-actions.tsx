import { Link } from '@tanstack/react-router'
import { Download, FileSpreadsheet, ListChecks, MoreHorizontal, QrCode } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { BatchItem } from '../data/qrcode-event.type'
import { useQrMutations } from '../hooks/use-qrcode-event-mutations'

export function QrBatchActions({ batch }: { batch: BatchItem }) {
  const { t } = useTranslation('qrcode_event')
  const { exportBatch, batchQrZip } = useQrMutations()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' aria-label={t('actions.more')}>
          <MoreHorizontal className='size-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem asChild>
          <Link to='/admin/qrcode-event/codes' search={{ batch_id: String(batch.id) }}>
            <ListChecks className='me-2 size-4' />
            {t('batches.viewCodes')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => exportBatch.mutate({ id: batch.id, format: 'xlsx' })}>
          <FileSpreadsheet className='me-2 size-4' />
          {t('batches.exportXlsx')}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => exportBatch.mutate({ id: batch.id, format: 'csv' })}>
          <Download className='me-2 size-4' />
          {t('batches.exportCsv')}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => batchQrZip.mutate(batch.id)}>
          <QrCode className='me-2 size-4' />
          {t('batches.qrZip')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
