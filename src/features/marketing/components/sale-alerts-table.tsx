import { MapPin, Pencil, Trash2 } from 'lucide-react'
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
import type { SaleAlert } from '../data/marketing.type'

interface Props {
  alerts: SaleAlert[]
  onEdit: (a: SaleAlert) => void
  onToggle: (a: SaleAlert) => void
  onDelete: (id: number) => void
}

export function SaleAlertsTable({ alerts, onEdit, onToggle, onDelete }: Props) {
  return (
    <div className='rounded-md border bg-card'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Məhsul</TableHead>
            <TableHead>Məkan / Şəhər</TableHead>
            <TableHead>Vaxt Göstəricisi</TableHead>
            <TableHead className='text-center'>Status</TableHead>
            <TableHead className='text-right'>Əməliyyatlar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alerts.map((a) => (
            <TableRow key={a.id}>
              <TableCell>
                <div className='flex items-center gap-3'>
                  <img
                    src={a.product_image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                    alt={a.product_name}
                    className='h-10 w-10 rounded border object-cover'
                  />
                  <span className='font-medium'>{a.product_name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className='flex items-center gap-1.5 text-sm text-muted-foreground'>
                  <MapPin className='h-3.5 w-3.5' />
                  <span>{a.location}</span>
                </div>
              </TableCell>
              <TableCell className='text-sm text-muted-foreground'>{a.time_ago}</TableCell>
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
              <TableCell colSpan={5} className='py-8 text-center text-muted-foreground'>
                Satış bildirişi tapılmadı
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
