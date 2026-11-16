import { useCurrencyFormatter } from '@/shared/hooks/useCurrencyFormatter'
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
import { useAffiliatePayments } from '../hooks/use-affiliate'

interface Props {
  user: { id: number; name: string } | null
  onClose: () => void
}

/** Everything paid out to one affiliate, newest first (a user has few rows, so one page of 100 is enough). */
export function AffiliatePaymentsDialog({ user, onClose }: Props) {
  const { t } = useTranslation('affiliate')
  const { formatMoney } = useCurrencyFormatter()
  const { data } = useAffiliatePayments(user?.id)
  const payments = data?.data ?? []

  return (
    <Dialog open={!!user} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{t('payments.title', { name: user?.name })}</DialogTitle>
          <DialogDescription>{t('payments.description')}</DialogDescription>
        </DialogHeader>
        <div className='max-h-[60vh] overflow-y-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('columns.date')}</TableHead>
                <TableHead>{t('columns.amount')}</TableHead>
                <TableHead>{t('columns.method')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className='text-center text-muted-foreground'
                  >
                    {t('payments.empty')}
                  </TableCell>
                </TableRow>
              )}
              {payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.created_at.slice(0, 10)}</TableCell>
                  <TableCell>{formatMoney(p.amount)}</TableCell>
                  <TableCell>{t(`pay.methods.${p.payment_method}`)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  )
}
