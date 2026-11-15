import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { PrizeBreakdownItem } from '../data/qrcode-event.type'
import { QrBadge } from './qr-badge'

export function QrPrizeBreakdown({ items }: { items: PrizeBreakdownItem[] }) {
  const { t } = useTranslation('qrcode_event')

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('stats.breakdown')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('prizes.columns.title')}</TableHead>
              <TableHead>{t('prizes.columns.type')}</TableHead>
              <TableHead className='text-end'>{t('prizes.columns.quantity')}</TableHead>
              <TableHead className='text-end'>{t('stats.revealed')}</TableHead>
              <TableHead className='text-end'>{t('stats.delivered')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className='py-6 text-center text-muted-foreground'>
                  {t('prizes.empty')}
                </TableCell>
              </TableRow>
            ) : (
              items.map((p) => (
                <TableRow key={p.prize_id}>
                  <TableCell className='font-medium'>{p.title}</TableCell>
                  <TableCell>
                    <QrBadge group='prize' value={p.type} />
                  </TableCell>
                  <TableCell className='text-end'>{p.quantity}</TableCell>
                  <TableCell className='text-end'>{p.revealed_count}</TableCell>
                  <TableCell className='text-end'>{p.delivered_count}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
