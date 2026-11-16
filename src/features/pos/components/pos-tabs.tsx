import { useTranslation } from 'react-i18next'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { Button } from '@/components/ui/button'

interface Props {
  items: readonly string[]
  /** i18n prefix inside the `pos` namespace (`tabs` → `tabs.all`). */
  labelKey: string
  search: Record<string, unknown>
  navigate: NavigateFn
}

/** Server-filter tab bar; the active tab lives in the URL (`?tab=`), the first item clears it. */
export function PosTabs({ items, labelKey, search, navigate }: Props) {
  const { t } = useTranslation('pos')
  const active = typeof search.tab === 'string' ? search.tab : items[0]

  return (
    <div role='tablist' className='flex flex-wrap gap-2'>
      {items.map((item) => (
        <Button
          key={item}
          role='tab'
          aria-selected={item === active}
          size='sm'
          variant={item === active ? 'default' : 'outline'}
          onClick={() =>
            navigate({
              search: (prev) => ({
                ...prev,
                tab: item === items[0] ? undefined : item,
                page: undefined,
              }),
            })
          }
        >
          {t(`${labelKey}.${item}`)}
        </Button>
      ))}
    </div>
  )
}
