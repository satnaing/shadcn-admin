import { useState } from 'react'
import { Check } from 'lucide-react'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { usePermissionStore } from '@/features/auth/data/auth-permission.store'
import { PERMISSIONS } from '@/shared/permissions'
import type { ThemeSummary } from '../data/themes.type'
import { useThemeT } from '../hooks/useThemeT'
import { useThemesQuery } from '../hooks/useThemes'
import { ThemeActivateDialog } from './theme-activate-dialog'

export function ThemesPage() {
  const t = useThemeT()
  const query = useThemesQuery()
  const canActivate = usePermissionStore((s) => s.hasPermission)(PERMISSIONS.THEMES.ACTIVATE)
  const [target, setTarget] = useState<ThemeSummary | null>(null)
  const themes = query.data?.data ?? []

  return (
    <AdminPageShell title={t('page.themesList')} description={t('page.themesList.description')}>
      {query.isLoading && <Skeleton className='h-40 w-full' />}
      {query.isError && <p className='text-destructive'>{t('common.loadFailed')}</p>}
      {!query.isLoading && !query.isError && themes.length === 0 && (
        <p className='text-muted-foreground'>{t('common.empty')}</p>
      )}

      <div className='grid gap-4 md:grid-cols-2'>
        {themes.map((theme) => (
          <Card key={theme.id} className={theme.active ? 'border-primary' : undefined}>
            <CardHeader>
              <div className='flex items-center justify-between gap-2'>
                <CardTitle>{theme.name}</CardTitle>
                {theme.active && (
                  <Badge>
                    <Check className='size-3' /> {t('themesPage.active')}
                  </Badge>
                )}
              </div>
              <CardDescription>{theme.description}</CardDescription>
            </CardHeader>
            <CardContent className='flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground'>
              <span>
                {theme.origin} · v{theme.version} · {t('themesPage.sections', { n: theme.sections })} · {t(`themesPage.policy.${theme.token_policy}`)}
              </span>
              {!theme.active && canActivate && (
                <Button size='sm' onClick={() => setTarget(theme)}>
                  {t('themesPage.activate')}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <ThemeActivateDialog theme={target} onClose={() => setTarget(null)} />
    </AdminPageShell>
  )
}
