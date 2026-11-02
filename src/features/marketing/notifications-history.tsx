import { Send } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
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
import type { NotificationHistoryItem } from './data/marketing.type'
import { useNotificationHistory } from './hooks/useMarketing'

export function NotificationHistoryPage() {
  const { data: history = [], isLoading } = useNotificationHistory()

  const getTargetBadge = (target: string) => {
    switch (target) {
      case 'all': return <Badge variant='outline'>Hamı</Badge>
      case 'customers': return <Badge variant='secondary'>Müştərilər</Badge>
      case 'sellers': return <Badge className='bg-primary/20 text-primary'>Satıcılar</Badge>
      default: return <Badge variant='outline'>{target}</Badge>
    }
  }

  return (
    <>
      <AdminHeader />
      <Main className='space-y-4 p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Xüsusi Bildiriş Tarixçəsi</h1>
            <p className='text-sm text-muted-foreground'>
              Əvvəllər göndərilmiş bildirişlərin arxiv və statistikası
            </p>
          </div>
          <Button asChild>
            <Link to='/admin/marketing/notifications/send'>
              <Send className='mr-2 h-4 w-4' /> Yeni Bildiriş
            </Link>
          </Button>
        </div>
        <div className='rounded-md border bg-card'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Başlıq / Məzmun</TableHead>
                <TableHead>Hədəf</TableHead>
                <TableHead>Kanal</TableHead>
                <TableHead>Alıcı Sayı</TableHead>
                <TableHead className='text-right'>Tarix</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className='py-8 text-center text-sm text-muted-foreground'>
                    Yüklənir...
                  </TableCell>
                </TableRow>
              ) : (
                history.map((h: NotificationHistoryItem) => (
                  <TableRow key={h.id}>
                    <TableCell>
                      <div className='font-medium'>{h.title}</div>
                      <div className='text-xs text-muted-foreground line-clamp-1'>{h.message}</div>
                    </TableCell>
                    <TableCell>{getTargetBadge(h.target_audience)}</TableCell>
                    <TableCell>
                      <Badge variant='outline' className='uppercase text-xs'>{h.channel}</Badge>
                    </TableCell>
                    <TableCell className='text-sm text-muted-foreground'>
                      {h.recipient_count.toLocaleString()} nəfər
                    </TableCell>
                    <TableCell className='text-right text-sm text-muted-foreground'>
                      {h.sent_at}
                    </TableCell>
                  </TableRow>
                ))
              )}
              {history.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className='py-8 text-center text-sm text-muted-foreground'>
                    Tarixçə tapılmadı
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Main>
    </>
  )
}
