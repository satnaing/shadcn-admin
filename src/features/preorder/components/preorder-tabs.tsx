import { useTranslation } from 'react-i18next'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { Button } from '@/components/ui/button'

interface Props {
  /** URL search key the tab writes (`?scope=`). */
  param: string
  items: readonly string[]
  /** i18n prefix inside the `preorder` namespace (`scope` → `scope.all`). */
  labelKey: string
  search: Record<string, unknown>
  navigate: NavigateFn
  counts?: Partial<Record<string, number>>
  fallback?: string
}

/** Server-filter tabs: the active tab is a URL param, the server does the filtering. */
export function PreorderTabs({
  param,
  items,
  labelKey,
  search,
  navigate,
  counts,
  fallback = items[0],
}: Props) {
  const { t } = useTranslation('preorder')
  const active =
    typeof search[param] === 'string' ? (search[param] as string) : fallback

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
                [param]: item === fallback ? undefined : item,
                page: undefined,
              }),
            })
          }
        >
          {t(`${labelKey}.${item}`)}
          {counts?.[item] !== undefined && (
            <span className='ms-1.5 text-xs opacity-80'>{counts[item]}</span>
          )}
        </Button>
      ))}
    </div>
  )
}
