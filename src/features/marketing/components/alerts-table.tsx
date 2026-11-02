import { Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { CustomAlert } from '../data/marketing.type'

interface Props {
  alerts: CustomAlert[]
  onEdit: (a: CustomAlert) => void
  onToggle: (a: CustomAlert) => void
  onDelete: (id: number) => void
}

export function AlertsTable({ alerts, onEdit, onToggle, onDelete }: Props) {
  const getTypeBadge = (type: CustomAlert['type']) => {
    switch (type) {
      case 'info': return <Badge variant='secondary'>Məlumat</Badge>
      case 'warning': return <Badge className='bg-amber-500 hover:bg-amber-600'>Xəbərdarlıq</Badge>
      case 'success': return <Badge className='bg-emerald-500 hover:bg-emerald-600'>Uğurlu</Badge>
      case 'danger': return <Badge variant='destructive'>Təcili</Badge>
    }
  }

  const getPositionLabel = (pos: CustomAlert['position']) => {
    switch (pos) {
      case 'top_banner': return 'Üst Başlıq'
      case 'bottom_banner': return 'Aşağı Zolaq'
      case 'floating': return 'Üzən Pəncərə'
    }
  }

  return (
    <div className='rounded-md border bg-card'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Başlıq / Mesaj</TableHead>
            <TableHead>Növ</TableHead>
            <TableHead>Mövqe</TableHead>
            <TableHead>Link</TableHead>
            <TableHead className='text-center'>Status</TableHead>
            <TableHead className='text-right'>Əməliyyatlar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alerts.map((a) => (
            <TableRow key={a.id}>
              <TableCell>
                <div className='font-medium'>{a.title}</div>
                <div className='text-xs text-muted-foreground line-clamp-1'>{a.message}</div>
              </TableCell>
              <TableCell>{getTypeBadge(a.type)}</TableCell>
              <TableCell className='text-sm text-muted-foreground'>{getPositionLabel(a.position)}</TableCell>
              <TableCell className='text-sm text-muted-foreground'>{a.link_text ?? '—'}</TableCell>
              <TableCell className='text-center'>
                <Switch checked={a.status} onCheckedChange={() => onToggle(a)} />
              </TableCell>
              <TableCell className='text-right space-x-1'>
                <Button variant='ghost' size='icon' onClick={() => onEdit(a)}>
                  <Pencil className='h-4 w-4' />
                </Button>
                <Button variant='ghost' size='icon' className='text-destructive' onClick={() => onDelete(a.id)}>
                  <Trash2 className='h-4 w-4' />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {alerts.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className='py-8 text-center text-muted-foreground'>
                Bildiriş banneri tapılmadı
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
