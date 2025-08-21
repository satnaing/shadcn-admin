import { CheckCircle2, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

type ConnectedBadgeProps = {
  label?: string
  status?: 'connected' | 'pending'
}

export function ConnectedBadge({ label, status = 'connected' }: ConnectedBadgeProps) {
  return (
    <Badge
      variant={status === 'connected' ? 'default' : 'secondary'}
      className={
        status === 'connected'
          ? 'bg-green-100 text-green-800 hover:bg-green-100/80'
          : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80'
      }
    >
      {status === 'connected' ? (
        <CheckCircle2 className='mr-1 h-3 w-3' />
      ) : (
        <Clock className='mr-1 h-3 w-3' />
      )}
      {label || 'Connected'}
    </Badge>
  )
}
