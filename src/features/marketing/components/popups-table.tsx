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
import type { DynamicPopup } from '../data/marketing.type'

interface Props {
  popups: DynamicPopup[]
  onEdit: (p: DynamicPopup) => void
  onToggle: (p: DynamicPopup) => void
  onDelete: (id: number) => void
}

export function PopupsTable({ popups, onEdit, onToggle, onDelete }: Props) {
  const getTriggerLabel = (type: DynamicPopup['trigger_type']) => {
    switch (type) {
      case 'on_load': return 'Səhifə yüklənəndə'
      case 'exit_intent': return 'Çıxış niyyətində'
      case 'delay': return 'Gecikmə ilə'
      case 'scroll': return 'Sürüşdürmədə'
    }
  }

  return (
    <div className='rounded-md border bg-card'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Başlıq</TableHead>
            <TableHead>Tətikləyici</TableHead>
            <TableHead>Dəyər</TableHead>
            <TableHead>Müddət</TableHead>
            <TableHead className='text-center'>Status</TableHead>
            <TableHead className='text-right'>Əməliyyatlar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {popups.map((p) => (
            <TableRow key={p.id}>
              <TableCell className='font-medium'>{p.title}</TableCell>
              <TableCell>
                <Badge variant='outline'>{getTriggerLabel(p.trigger_type)}</Badge>
              </TableCell>
              <TableCell className='text-sm text-muted-foreground'>
                {p.trigger_type === 'delay' ? `${p.trigger_value} san` : p.trigger_type === 'scroll' ? `${p.trigger_value}%` : '—'}
              </TableCell>
              <TableCell className='text-sm text-muted-foreground'>
                {p.start_date ? `${p.start_date} — ${p.end_date}` : 'Həmişə aktiv'}
              </TableCell>
              <TableCell className='text-center'>
                <Switch checked={p.status} onCheckedChange={() => onToggle(p)} />
              </TableCell>
              <TableCell className='text-right space-x-1'>
                <Button variant='ghost' size='icon' onClick={() => onEdit(p)}>
                  <Pencil className='h-4 w-4' />
                </Button>
                <Button variant='ghost' size='icon' className='text-destructive' onClick={() => onDelete(p.id)}>
                  <Trash2 className='h-4 w-4' />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {popups.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className='py-8 text-center text-muted-foreground'>
                Pop-up tapılmadı
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
