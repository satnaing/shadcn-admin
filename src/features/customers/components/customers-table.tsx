import { Ban, Eye, Trash2, Undo2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { type CustomerItem } from '../data/customers.type'

interface CustomersTableProps {
  customers: CustomerItem[]
  isLoading?: boolean
  onView: (customer: CustomerItem) => void
  onToggleBan: (id: number, current: boolean) => void
  onDelete: (id: number) => void
}

export function CustomersTable({
  customers,
  isLoading,
  onView,
  onToggleBan,
  onDelete,
}: CustomersTableProps) {
  const { t } = useTranslation('customers')

  if (isLoading) {
    return (
      <div className='flex h-48 items-center justify-center text-sm text-muted-foreground'>
        {t('loading', 'Yüklənir...')}
      </div>
    )
  }

  if (customers.length === 0) {
    return (
      <div className='flex h-48 items-center justify-center text-sm text-muted-foreground'>
        {t('noCustomers', 'Heç bir müştəri tapılmadı')}
      </div>
    )
  }

  return (
    <div className='rounded-md border bg-card'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[60px]'>#</TableHead>
            <TableHead>{t('table.name', 'Müştəri Adı')}</TableHead>
            <TableHead>{t('table.email', 'Email Ünvanı')}</TableHead>
            <TableHead>{t('table.phone', 'Telefon')}</TableHead>
            <TableHead>{t('table.package', 'Paket')}</TableHead>
            <TableHead>{t('table.balance', 'Balans')}</TableHead>
            <TableHead>{t('table.verification', 'Verifikasiya')}</TableHead>
            <TableHead>{t('table.status', 'Status')}</TableHead>
            <TableHead className='text-right'>{t('table.options', 'Əməliyyatlar')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((c, index) => (
            <TableRow key={c.id}>
              <TableCell className='text-muted-foreground'>{index + 1}</TableCell>
              <TableCell className='font-medium'>
                <button
                  type='button'
                  onClick={() => onView(c)}
                  className='text-left hover:text-primary hover:underline'
                >
                  {c.name}
                </button>
              </TableCell>
              <TableCell>{c.email}</TableCell>
              <TableCell>{c.phone}</TableCell>
              <TableCell>
                <span className='font-medium text-primary'>{c.package_name ?? '—'}</span>
              </TableCell>
              <TableCell className='font-semibold'>{c.balance.toFixed(2)} ₼</TableCell>
              <TableCell>
                {c.is_verified ? (
                  <Badge variant='success'>{t('verified', 'Təsdiqlənmiş')}</Badge>
                ) : (
                  <Badge variant='warning'>{t('unverified', 'Təsdiqlənməmiş')}</Badge>
                )}
              </TableCell>
              <TableCell>
                {c.is_banned ? (
                  <Badge variant='destructive'>{t('banned', 'Bloklanıb')}</Badge>
                ) : (
                  <Badge variant='outline' className='border-emerald-500/40 text-emerald-600'>
                    {t('active', 'Aktiv')}
                  </Badge>
                )}
              </TableCell>
              <TableCell className='text-right'>
                <div className='flex items-center justify-end gap-1'>
                  <Button variant='ghost' size='icon' onClick={() => onView(c)}>
                    <Eye className='size-4' />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => onToggleBan(c.id, c.is_banned)}
                    title={c.is_banned ? t('unban', 'Blokdan çıxar') : t('ban', 'Blokla')}
                  >
                    {c.is_banned ? <Undo2 className='size-4 text-emerald-600' /> : <Ban className='size-4 text-amber-600' />}
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='text-destructive hover:bg-destructive/10'
                    onClick={() => onDelete(c.id)}
                  >
                    <Trash2 className='size-4' />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
