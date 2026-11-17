import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { shouldSearch, toggleOption, type EntityOption } from './entity-picker.logic'

export interface EntityPickerProps {
  /** Cache key of the lookup, e.g. `['otp','recipients']`; the debounced query is appended. */
  queryKey: readonly unknown[]
  fetcher: (q: string) => Promise<EntityOption[]>
  selected: EntityOption[]
  onChange: (selected: EntityOption[]) => void
  multiple?: boolean
  minChars?: number
  placeholder?: string
  disabled?: boolean
}

/** Async single/multi picker: debounced `fetcher(q)`, result list, chosen entries as removable chips. */
export function EntityPicker({
  queryKey, fetcher, selected, onChange, multiple = false, minChars = 2, placeholder, disabled,
}: EntityPickerProps) {
  const { t } = useTranslation('common')
  const [q, setQ] = useState('')
  const debounced = useDebouncedValue(q)
  const enabled = shouldSearch(debounced, minChars)
  // The caller's `queryKey` identifies the lookup; `fetcher` is usually an inline closure.
  // eslint-disable-next-line @tanstack/query/exhaustive-deps
  const { data = [], isFetching } = useQuery({
    queryKey: [...queryKey, debounced],
    queryFn: () => fetcher(debounced.trim()),
    enabled,
  })
  const pick = (option: EntityOption) => {
    onChange(toggleOption(selected, option, multiple))
    if (!multiple) setQ('')
  }

  return (
    <div className='space-y-2'>
      <Input
        value={q}
        disabled={disabled}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder ?? t('entityPicker.search')}
        aria-label={placeholder ?? t('entityPicker.search')}
      />
      {shouldSearch(q, minChars) && (
        <ul className='max-h-56 divide-y overflow-auto rounded-md border' aria-busy={isFetching}>
          {enabled && !isFetching && data.length === 0 && (
            <li className='p-3 text-sm text-muted-foreground'>{t('entityPicker.noResults')}</li>
          )}
          {data.map((o) => (
            <li key={o.id}>
              <label className='flex cursor-pointer items-center gap-3 p-2 text-sm'>
                {multiple && <Checkbox checked={selected.some((s) => s.id === o.id)} onCheckedChange={() => pick(o)} />}
                <span className='flex-1' onClick={multiple ? undefined : () => pick(o)}>{o.label}</span>
                {o.hint && <span className='text-muted-foreground'>{o.hint}</span>}
              </label>
            </li>
          ))}
        </ul>
      )}
      <div className='flex flex-wrap gap-2'>
        {selected.map((o) => (
          <Badge key={o.id} variant='secondary' className='gap-1'>
            {o.label}
            <button type='button' aria-label={t('entityPicker.remove', { name: o.label })} onClick={() => pick(o)} disabled={disabled}>
              <X className='size-3' />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  )
}
