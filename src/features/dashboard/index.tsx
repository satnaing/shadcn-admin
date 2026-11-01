import { useTranslation } from 'react-i18next'
import { AdminPageShell } from '@/components/admin/admin-page-shell'

/** Boş skelet — blokları `task/admin/01-dashboard.md` doldurur. */
export function Dashboard() {
  const { t } = useTranslation('dashboard')

  return (
    <AdminPageShell title={t('title')} description={t('description')}>
      <p className='text-muted-foreground text-sm'>{t('empty')}</p>
    </AdminPageShell>
  )
}
