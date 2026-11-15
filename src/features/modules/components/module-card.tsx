import { Lock, MoreVertical, RefreshCw, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ModuleItem } from '@/api/modules.types'
import { PermissionGuard } from '@/components/guard'
import { usePermissionStore } from '@/features/auth/data/auth-permission.store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import { PERMISSIONS } from '@/shared/permissions'
import { ModuleIcon } from './module-icons'

interface Props {
  module: ModuleItem
  enabled: boolean
  /** Names of required modules that are currently off — shown as a warning. */
  missingDeps: string[]
  onToggle: (enabled: boolean) => void
  onUpdate: () => void
  onDelete: () => void
}

export function ModuleCard({ module, enabled, missingDeps, onToggle, onUpdate, onDelete }: Props) {
  const { t } = useTranslation('modules')
  const canToggle = usePermissionStore((s) => s.hasPermission(PERMISSIONS.MODULES.TOGGLE))
  const locked = module.required
  const status = !module.installed ? 'notInstalled' : enabled ? 'active' : 'inactive'

  return (
    <Card className='flex flex-col justify-between'>
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between gap-3'>
          <div className='flex items-center gap-2.5'>
            <div className='flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary'>
              <ModuleIcon name={module.icon} className='size-5' />
            </div>
            <div>
              <CardTitle className='text-sm font-semibold'>{module.name}</CardTitle>
              <span className='text-[11px] text-muted-foreground'>v{module.version}</span>
            </div>
          </div>
          <div className='flex items-center gap-1'>
            {locked && <Lock className='size-4 text-muted-foreground' aria-label={t('card.required')} />}
            <Switch
              checked={enabled}
              disabled={locked || !module.installed || !canToggle}
              onCheckedChange={onToggle}
              aria-label={module.name}
            />
            <ModuleMenu module={module} onUpdate={onUpdate} onDelete={onDelete} />
          </div>
        </div>
        <CardDescription className='pt-2 text-xs'>{module.description}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-2 pt-0'>
        {module.requires.length > 0 && (
          <p className='text-[11px] text-muted-foreground'>
            {t('card.requires')}: {module.requires.join(', ')}
          </p>
        )}
        {missingDeps.length > 0 && enabled && (
          <p className='text-[11px] text-destructive'>{t('card.missingDeps', { list: missingDeps.join(', ') })}</p>
        )}
        <div className='flex items-center justify-between'>
          <span className={`text-[11px] font-medium ${status === 'active' ? 'text-emerald-500' : 'text-muted-foreground'}`}>
            {status === 'active' ? '●' : '○'} {t(`status.${status}`)}
          </span>
          {module.update_available && (
            <PermissionGuard permission={PERMISSIONS.MODULES.UPDATE}>
              <Button variant='outline' size='sm' className='h-6 px-2 text-[11px]' onClick={onUpdate}>
                <RefreshCw className='me-1 size-3' />
                {t('card.updateTo', { v: module.update_available })}
              </Button>
            </PermissionGuard>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function ModuleMenu({ module, onUpdate, onDelete }: Pick<Props, 'module' | 'onUpdate' | 'onDelete'>) {
  const { t } = useTranslation('modules')
  const canDelete = !module.required && module.installed
  if (!module.update_available && !canDelete) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='size-8' aria-label={t('card.actions')}>
          <MoreVertical className='size-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {module.update_available && (
          <PermissionGuard permission={PERMISSIONS.MODULES.UPDATE}>
            <DropdownMenuItem onClick={onUpdate}>
              <RefreshCw className='me-2 size-4' />
              {t('card.update')}
            </DropdownMenuItem>
          </PermissionGuard>
        )}
        {canDelete && (
          <PermissionGuard permission={PERMISSIONS.MODULES.DELETE}>
            <DropdownMenuItem className='text-destructive' onClick={onDelete}>
              <Trash2 className='me-2 size-4' />
              {t('card.delete')}
            </DropdownMenuItem>
          </PermissionGuard>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
