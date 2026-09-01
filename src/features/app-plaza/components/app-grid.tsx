import { format } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  type AppItem,
  appMethodLabels,
  appTypeLabels,
  methodToType,
} from '../data/app-types'

type AppGridProps = {
  apps: AppItem[]
  onDelete: (id: string) => void
}

export function AppGrid({ apps, onDelete }: AppGridProps) {
  if (apps.length === 0) {
    return (
      <p className='py-16 text-center text-sm text-muted-foreground'>
        暂无应用，点击右上角「创建应用」开始吧。
      </p>
    )
  }

  return (
    <ul className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {apps.map((app) => {
        const type = methodToType(app.method)
        const initial = app.name.trim().charAt(0).toUpperCase() || 'A'
        return (
          <li
            key={app.id}
            className='group relative flex flex-col gap-3 rounded-lg border bg-card p-5 shadow-xs transition-colors hover:bg-accent/50'
          >
            <div className='flex items-center gap-3'>
              <Avatar className='size-11'>
                {app.avatar.startsWith('data:') && (
                  <AvatarImage src={app.avatar} alt={app.name} />
                )}
                <AvatarFallback
                  className={cn(
                    'bg-gradient-to-br text-sm text-white',
                    app.avatar && !app.avatar.startsWith('data:')
                      ? app.avatar
                      : 'from-blue-500 to-indigo-500'
                  )}
                >
                  {initial}
                </AvatarFallback>
              </Avatar>
              <div className='min-w-0 flex-1'>
                <div className='flex items-center gap-2'>
                  <h3 className='truncate font-semibold'>{app.name}</h3>
                  <Badge variant='secondary' className='shrink-0 text-xs'>
                    {appTypeLabels[type]}
                  </Badge>
                </div>
                <p className='mt-0.5 text-xs text-muted-foreground'>
                  {appMethodLabels[app.method]} ·{' '}
                  {format(app.createdAt, 'yyyy-MM-dd')}
                </p>
              </div>
            </div>
            <p className='line-clamp-2 text-sm text-muted-foreground'>
              {app.description || '暂无描述'}
            </p>
            <div className='flex items-center justify-between'>
              <span className='text-xs text-muted-foreground'>创建应用</span>
              <button
                type='button'
                className='text-xs text-muted-foreground underline-offset-2 opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive hover:underline'
                onClick={() => onDelete(app.id)}
              >
                删除
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
