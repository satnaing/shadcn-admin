import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import type { NavigateFn } from '@/hooks/use-table-url-state'

interface Props {
  /** First entry is the default (no `?tab=` in the URL). */
  tabs: readonly string[]
  /** i18n prefix of the labels, e.g. `walletTabs` → `walletTabs.pending`. */
  labelPrefix: string
  search: Record<string, unknown>
  navigate: NavigateFn
}

/** Status tabs above a list; the active one is a server filter (`?tab=`). */
export function PaymentsTabs({ tabs, labelPrefix, search, navigate }: Props) {
  const { t } = useTranslation('payments')
  const active = typeof search.tab === 'string' ? search.tab : tabs[0]

  return (
    <div role='tablist' className='flex flex-wrap gap-2'>
      {tabs.map((tab) => (
        <Button
          key={tab}
          role='tab'
          aria-selected={tab === active}
          size='sm'
          variant={tab === active ? 'default' : 'outline'}
          onClick={() =>
            navigate({ search: (prev) => ({ ...prev, tab: tab === tabs[0] ? undefined : tab, page: undefined }) })
          }
        >
          {t(`${labelPrefix}.${tab}`)}
        </Button>
      ))}
    </div>
  )
}
