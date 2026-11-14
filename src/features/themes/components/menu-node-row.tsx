import { GripVertical, Pencil, Plus, Trash2 } from 'lucide-react'
import { SortableItem } from '@/components/sortable-item'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { MAX_DEPTH } from '../data/menu-tree'
import type { MenuNode } from '../data/themes.type'
import { useThemeT } from '../hooks/useThemeT'

export interface MenuHandlers {
  locale: string
  onEdit: (node: MenuNode) => void
  onAddChild: (id: string) => void
  onRemove: (id: string) => void
  onToggle: (id: string) => void
}

interface MenuNodeRowProps {
  node: MenuNode
  depth: number
  handlers: MenuHandlers
}

export function MenuNodeRow({ node, depth, handlers }: MenuNodeRowProps) {
  const t = useThemeT()
  const label = node.label[handlers.locale] || node.label.az || node.id

  return (
    <SortableItem id={node.id} className='flex list-none items-center gap-2 rounded-md border bg-card p-2'>
      {({ attributes, listeners }) => (
        <>
          <Button type='button' size='icon' variant='ghost' aria-label={t('common.drag')} {...attributes} {...listeners}>
            <GripVertical className='size-4' />
          </Button>
          <div className='min-w-0 flex-1'>
            <p className='truncate text-sm font-medium'>{node.icon} {label}</p>
            <p className='truncate text-xs text-muted-foreground'>{node.href || t('menu.groupOnly')}</p>
          </div>
          <Badge variant='outline'>{node.type}</Badge>
          <Switch checked={node.enabled} aria-label={t('leaf.enabled')} onCheckedChange={() => handlers.onToggle(node.id)} />
          <Button type='button' size='icon' variant='ghost' aria-label={t('common.edit')} onClick={() => handlers.onEdit(node)}>
            <Pencil className='size-4' />
          </Button>
          {depth < MAX_DEPTH && (
            <Button type='button' size='icon' variant='ghost' aria-label={t('menu.addChild')} onClick={() => handlers.onAddChild(node.id)}>
              <Plus className='size-4' />
            </Button>
          )}
          <Button type='button' size='icon' variant='ghost' aria-label={t('common.remove')} onClick={() => handlers.onRemove(node.id)}>
            <Trash2 className='size-4' />
          </Button>
        </>
      )}
    </SortableItem>
  )
}
