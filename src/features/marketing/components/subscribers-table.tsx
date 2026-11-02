import { Trash2 } from 'lucide-react'
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
import type { SubscriberItem } from '../data/marketing.type'

interface Props {
  subscribers: SubscriberItem[]
  onDelete: (id: number) => void
}

export function SubscribersTable({ subscribers, onDelete }: Props) {
  return (
    <div className='rounded-md border bg-card'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>E-poçt Ünvanı</TableHead>
            <TableHead>Abunə Tarixi</TableHead>
            <TableHead className='text-center'>Status</TableHead>
            <TableHead className='text-right'>Əməliyyat</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscribers.map((s, idx) => (
            <TableRow key={s.id}>
              <TableCell className='text-muted-foreground'>{idx + 1}</TableCell>
              <TableCell className='font-medium'>{s.email}</TableCell>
              <TableCell className='text-sm text-muted-foreground'>{s.subscribed_at}</TableCell>
              <TableCell className='text-center'>
                <Badge variant={s.status ? 'default' : 'secondary'}>
                  {s.status ? 'Aktiv' : 'Qeyri-aktiv'}
                </Badge>
              </TableCell>
              <TableCell className='text-right'>
                <Button variant='ghost' size='icon' className='text-destructive' onClick={() => onDelete(s.id)}>
                  <Trash2 className='h-4 w-4' />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {subscribers.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className='py-8 text-center text-muted-foreground'>
                Abunəçi tapılmadı
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
