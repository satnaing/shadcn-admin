import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import type { PosCustomer } from '../data/pos.type'
import { usePosCustomerSearch } from '../hooks/use-pos'

/** Registered-customer lookup by phone or e-mail, from 3 characters on (AEC `pos.search-customers`). */
export function PosCustomerSearch({
  onSelect,
}: {
  onSelect: (customer: PosCustomer) => void
}) {
  const { t } = useTranslation('pos')
  const [field, setField] = useState<'phone' | 'email'>('phone')
  const [q, setQ] = useState('')
  const term = useDebouncedValue(q.trim())
  const found = usePosCustomerSearch(field, term).data?.data ?? []

  return (
    <div className='space-y-2'>
      <div className='flex gap-2'>
        <Select
          value={field}
          onValueChange={(v) => setField(v as 'phone' | 'email')}
        >
          <SelectTrigger className='w-32' aria-label={t('customer.searchBy')}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='phone'>{t('customer.phone')}</SelectItem>
            <SelectItem value='email'>{t('customer.email')}</SelectItem>
          </SelectContent>
        </Select>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t('customer.searchHint')}
          aria-label={t('customer.searchHint')}
        />
      </div>
      {term.length >= 3 && (
        <ul className='max-h-48 overflow-y-auto rounded-md border'>
          {found.length === 0 && (
            <li className='p-3 text-sm text-muted-foreground'>
              {t('customer.notFound')}
            </li>
          )}
          {found.map((c) => (
            <li key={c.id}>
              <button
                type='button'
                className='w-full px-3 py-2 text-start text-sm hover:bg-accent'
                onClick={() => onSelect(c)}
              >
                <span className='font-medium'>{c.name}</span>
                <span className='ms-2 text-muted-foreground'>
                  {field === 'phone' ? c.phone : c.email}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
