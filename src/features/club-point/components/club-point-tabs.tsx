import type { NavigateFn } from '@/hooks/use-table-url-state'
import { Button } from '@/components/ui/button'

interface Props {
  tabs: ReadonlyArray<{ value: string; label: string }>
  search: Record<string, unknown>
  navigate: NavigateFn
}

/** Server-filter tab bar; the active tab lives in the URL (`?tab=`), `all` clears it. */
export function ClubPointTabs({ tabs, search, navigate }: Props) {
  const active = typeof search.tab === 'string' ? search.tab : 'all'

  return (
    <div role='tablist' className='flex flex-wrap gap-2'>
      {tabs.map((tab) => (
        <Button
          key={tab.value}
          role='tab'
          aria-selected={tab.value === active}
          size='sm'
          variant={tab.value === active ? 'default' : 'outline'}
          onClick={() =>
            navigate({
              search: (prev) => ({
                ...prev,
                tab: tab.value === 'all' ? undefined : tab.value,
                page: undefined,
              }),
            })
          }
        >
          {tab.label}
        </Button>
      ))}
    </div>
  )
}
