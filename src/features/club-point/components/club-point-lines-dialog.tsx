import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useEarning } from '../hooks/use-club-point'

interface Props {
  earning: { id: number; order_code: string | null } | null
  onClose: () => void
}

/** Points per product of one order (an order has few lines, so no paging). */
export function ClubPointLinesDialog({ earning, onClose }: Props) {
  const { t } = useTranslation('club_point')
  const lines = useEarning(earning?.id).data?.data.lines ?? []

  return (
    <Dialog open={!!earning} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {t('lines.title', { code: earning?.order_code ?? '—' })}
          </DialogTitle>
          <DialogDescription>{t('lines.description')}</DialogDescription>
        </DialogHeader>
        <div className='max-h-[60vh] overflow-y-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('columns.product')}</TableHead>
                <TableHead>{t('columns.points')}</TableHead>
                <TableHead>{t('columns.earnedAt')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lines.map((line) => (
                <TableRow key={line.id}>
                  <TableCell>
                    {line.product_name ?? t('lines.deletedProduct')}
                  </TableCell>
                  <TableCell>{line.points}</TableCell>
                  <TableCell>{line.created_at.slice(0, 10)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  )
}
