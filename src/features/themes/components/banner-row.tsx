import { GripVertical, Pencil, Trash2 } from 'lucide-react'
import { SortableItem } from '@/components/sortable-item'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import type { Banner } from '../data/themes.type'
import { useThemeT } from '../hooks/useThemeT'

interface BannerRowProps {
  banner: Banner
  locale: string
  onToggle: (id: number) => void
  onEdit: (banner: Banner) => void
  onDelete: (id: number) => void
}

export function BannerRow({ banner, locale, onToggle, onEdit, onDelete }: BannerRowProps) {
  const t = useThemeT()
  const title = banner.title[locale] || banner.title.az || `#${banner.id}`
  const schedule = [banner.starts_at, banner.ends_at].filter(Boolean).join(' → ')

  return (
    <SortableItem id={String(banner.id)} className='flex list-none items-center gap-3 rounded-md border bg-card p-2'>
      {({ attributes, listeners }) => (
        <>
          <Button type='button' size='icon' variant='ghost' aria-label={t('common.drag')} {...attributes} {...listeners}>
            <GripVertical className='size-4' />
          </Button>
          {banner.image ? (
            <img src={banner.image} alt={banner.alt} loading='lazy' width={64} height={40} className='h-10 w-16 rounded object-cover' />
          ) : (
            <div className='h-10 w-16 rounded bg-muted' />
          )}
          <div className='min-w-0 flex-1'>
            <p className='truncate text-sm font-medium'>{title}</p>
            <p className='truncate text-xs text-muted-foreground'>{schedule || t('banners.noSchedule')}</p>
          </div>
          <Badge variant='outline'>{banner.group}</Badge>
          <Switch checked={banner.enabled} aria-label={t('leaf.enabled')} onCheckedChange={() => onToggle(banner.id)} />
          <Button type='button' size='icon' variant='ghost' aria-label={t('common.edit')} onClick={() => onEdit(banner)}>
            <Pencil className='size-4' />
          </Button>
          <Button type='button' size='icon' variant='ghost' aria-label={t('common.remove')} onClick={() => onDelete(banner.id)}>
            <Trash2 className='size-4' />
          </Button>
        </>
      )}
    </SortableItem>
  )
}
