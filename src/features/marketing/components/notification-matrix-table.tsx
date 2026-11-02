import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { NotificationTypeItem } from '../data/marketing.type'

interface Props {
  types: NotificationTypeItem[]
  onToggleChannel: (item: NotificationTypeItem, channel: 'email' | 'sms' | 'push' | 'system') => void
}

export function NotificationMatrixTable({ types, onToggleChannel }: Props) {
  return (
    <div className='rounded-md border bg-card'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Hadisə Növü</TableHead>
            <TableHead className='text-center'>E-poçt</TableHead>
            <TableHead className='text-center'>SMS</TableHead>
            <TableHead className='text-center'>Push Bildiriş</TableHead>
            <TableHead className='text-center'>Sistem / Sayt</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {types.map((t) => (
            <TableRow key={t.id}>
              <TableCell className='font-medium'>{t.name}</TableCell>
              <TableCell className='text-center'>
                <Switch
                  checked={t.email_channel}
                  onCheckedChange={() => onToggleChannel(t, 'email')}
                />
              </TableCell>
              <TableCell className='text-center'>
                <Switch
                  checked={t.sms_channel}
                  onCheckedChange={() => onToggleChannel(t, 'sms')}
                />
              </TableCell>
              <TableCell className='text-center'>
                <Switch
                  checked={t.push_channel}
                  onCheckedChange={() => onToggleChannel(t, 'push')}
                />
              </TableCell>
              <TableCell className='text-center'>
                <Switch
                  checked={t.system_channel}
                  onCheckedChange={() => onToggleChannel(t, 'system')}
                />
              </TableCell>
            </TableRow>
          ))}
          {types.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className='py-8 text-center text-muted-foreground'>
                Bildiriş növü tapılmadı
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
