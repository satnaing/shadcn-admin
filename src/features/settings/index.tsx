import { Suspense } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { AdminCardShell } from '@/components/admin/admin-card-shell'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { usePermissionStore } from '@/features/auth/data/auth-permission.store'
import { cn } from '@/lib/utils'
import { SETTINGS_TABS, type SettingsTabId } from './settings-tabs'

const route = getRouteApi('/_authenticated/admin/settings/')

export function SettingsPage() {
  const { t } = useTranslation('settings')
  const { tab } = route.useSearch()
  const navigate = route.useNavigate()
  const onTabChange = (next: SettingsTabId) => navigate({ search: { tab: next } })
  const hasPermission = usePermissionStore((s) => s.hasPermission)
  const tabs = SETTINGS_TABS.filter((item) => hasPermission(item.permission))
  const active = tabs.find((item) => item.id === tab) ?? tabs[0]

  return (
    <AdminPageShell title={t('title')} description={t('description')}>
      {!active ? (
        <p className='py-10 text-center text-muted-foreground'>{t('common.noAccess')}</p>
      ) : (
        <div className='flex flex-col gap-4 lg:flex-row'>
          <nav aria-label={t('title')} className='flex gap-1 overflow-x-auto lg:w-56 lg:shrink-0 lg:flex-col'>
            {tabs.map(({ id, icon: Icon }) => (
              <Button
                key={id}
                variant='ghost'
                aria-current={id === active.id ? 'page' : undefined}
                className={cn('justify-start', id === active.id && 'bg-muted font-medium')}
                onClick={() => onTabChange(id)}
              >
                <Icon className='size-4' /> {t(`tabs.${id}`)}
              </Button>
            ))}
          </nav>
          <div className='min-w-0 flex-1'>
            <AdminCardShell>
              <Suspense fallback={<Skeleton className='h-72 w-full' />}>
                <active.Component />
              </Suspense>
            </AdminCardShell>
          </div>
        </div>
      )}
    </AdminPageShell>
  )
}
