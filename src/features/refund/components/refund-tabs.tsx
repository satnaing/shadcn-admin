import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { REFUND_TABS } from '../data/refund.type'

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

/** Status / seller-type / channel tabs of the refund lists; the active one is a server filter (`?tab=`). */
export function RefundTabs({ search, navigate }: Props) {
  const { t } = useTranslation('refund')
  const active = typeof search.tab === 'string' ? search.tab : 'all'

  return (
    <div role='tablist' className='flex flex-wrap gap-2'>
      {REFUND_TABS.map((tab) => (
        <Button
          key={tab}
          role='tab'
          aria-selected={tab === active}
          size='sm'
          variant={tab === active ? 'default' : 'outline'}
          onClick={() =>
            navigate({ search: (prev) => ({ ...prev, tab: tab === 'all' ? undefined : tab, page: undefined }) })
          }
        >
          {t(`tabs.${tab}`)}
        </Button>
      ))}
    </div>
  )
}
