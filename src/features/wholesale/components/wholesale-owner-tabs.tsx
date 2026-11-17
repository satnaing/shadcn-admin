import { useTranslation } from 'react-i18next'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { Button } from '@/components/ui/button'
import type { OwnerTab } from '../hooks/use-owner-tabs'

interface Props {
  tabs: OwnerTab[]
  active: OwnerTab
  navigate: NavigateFn
}

/** Server-filter tabs: AEC had three menu items (all / in-house / seller), here they are one list. */
export function WholesaleOwnerTabs({ tabs, active, navigate }: Props) {
  const { t } = useTranslation('wholesale')

  return (
    <div role='tablist' className='flex flex-wrap gap-2'>
      {tabs.map((id) => (
        <Button
          key={id}
          role='tab'
          aria-selected={id === active}
          size='sm'
          variant={id === active ? 'default' : 'outline'}
          onClick={() =>
            navigate({
              search: (prev) => ({
                ...prev,
                owner: id === tabs[0] ? undefined : id,
                seller: undefined,
                page: undefined,
              }),
            })
          }
        >
          {t(`owner.${id}`)}
        </Button>
      ))}
    </div>
  )
}
