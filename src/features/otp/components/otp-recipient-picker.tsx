import { useState } from 'react'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { useOtpRecipients } from '../hooks/use-otp'

interface Props {
  value: string[]
  onChange: (phones: string[]) => void
}

/** Server-searched multi-select of customers with a phone number; chosen numbers stay as removable badges. */
export function OtpRecipientPicker({ value, onChange }: Props) {
  const { t } = useTranslation('otp')
  const [q, setQ] = useState('')
  const { data, isFetching } = useOtpRecipients(useDebouncedValue(q))
  const results = data?.data ?? []
  const toggle = (phone: string) =>
    onChange(value.includes(phone) ? value.filter((p) => p !== phone) : [...value, phone])

  return (
    <div className='space-y-3'>
      <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('bulk.search')} aria-label={t('bulk.search')} />
      {q.trim().length >= 2 && (
        <ul className='max-h-56 divide-y overflow-auto rounded-md border' aria-busy={isFetching}>
          {results.length === 0 && <li className='p-3 text-sm text-muted-foreground'>{t('bulk.noResults')}</li>}
          {results.map((r) => (
            <li key={r.id}>
              <label className='flex cursor-pointer items-center gap-3 p-2 text-sm'>
                <Checkbox checked={value.includes(r.phone)} onCheckedChange={() => toggle(r.phone)} />
                <span className='flex-1'>{r.name}</span>
                <span className='text-muted-foreground'>{r.phone}</span>
              </label>
            </li>
          ))}
        </ul>
      )}
      <div className='flex flex-wrap gap-2'>
        {value.map((phone) => (
          <Badge key={phone} variant='secondary' className='gap-1'>
            {phone}
            <button type='button' aria-label={t('bulk.remove', { phone })} onClick={() => toggle(phone)}>
              <X className='size-3' />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  )
}
