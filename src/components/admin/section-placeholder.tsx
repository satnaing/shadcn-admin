import { Construction } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'

/** Temporary page body — the owning feature section replaces the route component. */
export function SectionPlaceholder({ titleKey }: { titleKey: string }) {
  const { t } = useTranslation(['nav', 'common'])

  return (
    <>
      <AdminHeader />
      <Main>
        <div className='flex flex-col items-center gap-2 py-24 text-muted-foreground'>
          <Construction className='size-10' />
          <h1 className='text-xl font-semibold text-foreground'>{t(titleKey, { ns: 'nav' })}</h1>
        </div>
      </Main>
    </>
  )
}
