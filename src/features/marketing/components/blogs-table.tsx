import { Eye, Pencil, Trash2 } from 'lucide-react'
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
import type { BlogPost } from '../data/marketing.type'

interface Props {
  blogs: BlogPost[]
  onEdit: (b: BlogPost) => void
  onToggle: (b: BlogPost) => void
  onDelete: (id: number) => void
}

export function BlogsTable({ blogs, onEdit, onToggle, onDelete }: Props) {
  return (
    <div className='rounded-md border bg-card'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Məqalə</TableHead>
            <TableHead>Kateqoriya</TableHead>
            <TableHead>Baxış</TableHead>
            <TableHead>Tarix</TableHead>
            <TableHead className='text-center'>Status</TableHead>
            <TableHead className='text-right'>Əməliyyatlar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogs.map((b) => (
            <TableRow key={b.id}>
              <TableCell>
                <div className='flex items-center gap-3'>
                  <img
                    src={b.banner || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=120'}
                    alt={b.title}
                    className='h-10 w-14 rounded object-cover border'
                  />
                  <div>
                    <div className='font-medium'>{b.title}</div>
                    <div className='text-xs text-muted-foreground line-clamp-1'>{b.short_description}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant='outline'>{b.category_name}</Badge>
              </TableCell>
              <TableCell>
                <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                  <Eye className='h-3.5 w-3.5' />
                  <span>{b.views.toLocaleString()}</span>
                </div>
              </TableCell>
              <TableCell className='text-sm text-muted-foreground'>{b.created_at}</TableCell>
              <TableCell className='text-center'>
                <Switch checked={b.status} onCheckedChange={() => onToggle(b)} />
              </TableCell>
              <TableCell className='text-right space-x-1'>
                <Button variant='ghost' size='icon' onClick={() => onEdit(b)}>
                  <Pencil className='h-4 w-4' />
                </Button>
                <Button variant='ghost' size='icon' className='text-destructive' onClick={() => onDelete(b.id)}>
                  <Trash2 className='h-4 w-4' />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {blogs.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className='py-8 text-center text-muted-foreground'>
                Bloq məqaləsi tapılmadı
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
