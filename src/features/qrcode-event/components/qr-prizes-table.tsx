import { Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { PrizeItem } from '../data/qrcode-event.type'
import { QrBadge } from './qr-badge'

interface Props {
  prizes: PrizeItem[]
  onEdit: (prize: PrizeItem) => void
  onDelete: (prize: PrizeItem) => void
}

export function QrPrizesTable({ prizes, onEdit, onDelete }: Props) {
  const { t } = useTranslation('qrcode_event')
  const heads = ['title', 'type', 'value', 'quantity', 'allocated', 'claimed'] as const

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {heads.map((h) => (
            <TableHead key={h}>{t(`prizes.columns.${h}`)}</TableHead>
          ))}
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {prizes.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className='py-8 text-center text-muted-foreground'>
              {t('prizes.empty')}
            </TableCell>
          </TableRow>
        ) : (
          prizes.map((p) => (
            <TableRow key={p.id}>
              <TableCell className='font-medium'>{p.title}</TableCell>
              <TableCell>
                <QrBadge group='prize' value={p.type} />
              </TableCell>
              <TableCell>{p.type === 'cash' ? p.value : '—'}</TableCell>
              <TableCell>{p.quantity}</TableCell>
              <TableCell>{p.allocated_count}</TableCell>
              <TableCell>{p.claimed_count}</TableCell>
              <TableCell className='text-end'>
                <Button variant='ghost' size='icon' aria-label={t('actions.edit')} onClick={() => onEdit(p)}>
                  <Pencil className='size-4' />
                </Button>
                <Button variant='ghost' size='icon' className='text-destructive' aria-label={t('actions.delete')} onClick={() => onDelete(p)}>
                  <Trash2 className='size-4' />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
