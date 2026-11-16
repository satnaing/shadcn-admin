import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import type { CustomerLookup } from '../data/payments.type'
import { usePaymentsCustomers } from '../hooks/use-payments'

interface Props {
  value: number | undefined
  onChange: (id: number | undefined) => void
}

/** Server-searched single customer (2 characters minimum); the chosen one is shown under the input. */
export function PaymentsCustomerPicker({ value, onChange }: Props) {
  const { t } = useTranslation('payments')
  const [q, setQ] = useState('')
  const [chosen, setChosen] = useState<CustomerLookup | null>(null)
  const { data, isFetching } = usePaymentsCustomers(useDebouncedValue(q))
  const results = data?.data ?? []

  return (
    <div className='space-y-2'>
      <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('recharge.search')} aria-label={t('recharge.search')} />
      {q.trim().length >= 2 && (
        <ul className='max-h-44 divide-y overflow-auto rounded-md border' aria-busy={isFetching}>
          {results.length === 0 && <li className='p-3 text-sm text-muted-foreground'>{t('recharge.noResults')}</li>}
          {results.map((c) => (
            <li key={c.id}>
              <button
                type='button'
                className='flex w-full items-center justify-between p-2 text-start text-sm hover:bg-accent'
                onClick={() => {
                  setChosen(c)
                  onChange(c.id)
                  setQ('')
                }}
              >
                <span>{c.name}</span>
                <span className='text-muted-foreground'>{c.email}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {value && chosen && (
        <p className='text-sm'>
          {t('recharge.chosen')}: <strong>{chosen.name}</strong> ({chosen.email})
        </p>
      )}
    </div>
  )
}
