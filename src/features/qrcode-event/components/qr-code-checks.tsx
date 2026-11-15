import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { CheckItem } from '../data/qrcode-event.type'
import { QrBadge } from './qr-badge'

/** Last scans of one code (AEC shows the 50 latest). */
export function QrCodeChecks({ checks }: { checks: CheckItem[] }) {
  const { t } = useTranslation('qrcode_event')

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('codes.detail.checks')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('logs.columns.at')}</TableHead>
              <TableHead>{t('logs.columns.result')}</TableHead>
              <TableHead>{t('logs.columns.user')}</TableHead>
              <TableHead>{t('logs.columns.ip')}</TableHead>
              <TableHead>{t('logs.columns.source')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {checks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className='py-6 text-center text-muted-foreground'>
                  {t('codes.detail.noChecks')}
                </TableCell>
              </TableRow>
            ) : (
              checks.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.created_at.slice(0, 16).replace('T', ' ')}</TableCell>
                  <TableCell>
                    <QrBadge group='result' value={c.result} />
                  </TableCell>
                  <TableCell>{c.user_name ?? '—'}</TableCell>
                  <TableCell className='font-mono'>{c.ip}</TableCell>
                  <TableCell>{c.source}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
