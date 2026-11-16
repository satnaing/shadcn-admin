import type { NavigateFn } from '@/hooks/use-table-url-state'
import { Input } from '@/components/ui/input'

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
  labels: { from: string; to: string }
}

/** From/to day filter kept in the URL (`?from=&to=`, `YYYY-MM-DD`); the server filters by creation date. */
export function DateRangeFilter({ search, navigate, labels }: Props) {
  const field = (key: 'from' | 'to') => (
    <label className='flex items-center gap-2 text-sm text-muted-foreground'>
      {labels[key]}
      <Input
        type='date'
        className='h-8 w-40'
        value={typeof search[key] === 'string' ? (search[key] as string) : ''}
        onChange={(e) => navigate({ search: (prev) => ({ ...prev, [key]: e.target.value || undefined, page: undefined }) })}
      />
    </label>
  )

  return (
    <div className='flex flex-wrap items-center gap-3'>
      {field('from')}
      {field('to')}
    </div>
  )
}
