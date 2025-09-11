import { Hash, User, List } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TagAttributes } from './tag-node'

interface TagViewProps {
  type: TagAttributes['type']
  label: string
  subtype?: TagAttributes['subtype']
  className?: string
}

export function TagView({ type, label, subtype, className }: TagViewProps) {
  const getIcon = () => {
    if (type === 'channel') {
      // For the new grouped channel type, use subtype to determine icon
      return subtype === 'hubspot-list' ? (
        <List className='h-3 w-3' />
      ) : (
        <Hash className='h-3 w-3' />
      )
    }

    switch (type) {
      case 'slack-channel':
        return <Hash className='h-3 w-3' />
      case 'user':
        return <User className='h-3 w-3' />
      case 'hubspot-list':
        return <List className='h-3 w-3' />
      default:
        return <Hash className='h-3 w-3' />
    }
  }

  const getColorClass = () => {
    if (type === 'channel') {
      // For the new grouped channel type, use subtype to determine color
      return subtype === 'hubspot-list'
        ? 'bg-orange-100 text-orange-800 border-orange-200'
        : 'bg-purple-100 text-purple-800 border-purple-200'
    }

    switch (type) {
      case 'slack-channel':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'user':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'hubspot-list':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-purple-100 text-purple-800 border-purple-200'
    }
  }

  return (
    <span
      className={cn(
        'mx-1 inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium',
        'cursor-default',
        getColorClass(),
        className
      )}
    >
      {getIcon()}
      <span>{label}</span>
    </span>
  )
}
