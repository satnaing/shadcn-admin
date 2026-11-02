import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Ga4ReportEvent } from '../data/analytics.type'

interface Props {
  events: Ga4ReportEvent[]
}

export function AnalyticsReportChart({ events }: Props) {
  const getEventBadge = (name: string) => {
    switch (name) {
      case 'purchase': return <Badge className='bg-emerald-500 hover:bg-emerald-600'>{name}</Badge>
      case 'add_to_cart': return <Badge className='bg-blue-500 hover:bg-blue-600'>{name}</Badge>
      case 'view_item': return <Badge variant='secondary'>{name}</Badge>
      default: return <Badge variant='outline'>{name}</Badge>
    }
  }

  return (
    <div className='rounded-md border bg-card'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Hadisə Adı</TableHead>
            <TableHead>Kateqoriya</TableHead>
            <TableHead>Məbləğ / Dəyər</TableHead>
            <TableHead>Cihaz</TableHead>
            <TableHead>Ölkə</TableHead>
            <TableHead className='text-right'>Zaman</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((e) => (
            <TableRow key={e.id}>
              <TableCell>{getEventBadge(e.event_name)}</TableCell>
              <TableCell className='text-sm text-muted-foreground'>{e.category}</TableCell>
              <TableCell className='font-mono text-sm'>
                {e.value ? `$${e.value.toFixed(2)}` : '—'}
              </TableCell>
              <TableCell className='text-sm text-muted-foreground'>{e.device}</TableCell>
              <TableCell className='text-sm text-muted-foreground'>{e.country}</TableCell>
              <TableCell className='text-right font-mono text-xs text-muted-foreground'>
                {e.timestamp}
              </TableCell>
            </TableRow>
          ))}
          {events.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className='py-8 text-center text-sm text-muted-foreground'>
                Canlı hadisə qeydə alınmayıb
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
