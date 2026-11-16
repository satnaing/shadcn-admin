import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { PosGuestInfo } from '../data/pos.type'

interface Props {
  guest: PosGuestInfo
  onChange: (guest: PosGuestInfo) => void
  /** Field → i18n key, from the zod check done when the cashier presses "Place order". */
  errors: Partial<Record<keyof PosGuestInfo, string>>
}

/** Shipping info for walk-in / Facebook / WhatsApp orders (AEC `guest_shipping_address`). */
export function PosGuestForm({ guest, onChange, errors }: Props) {
  const { t } = useTranslation('pos')
  const field = (name: keyof PosGuestInfo, type = 'text') => (
    <div className='space-y-1'>
      <Label htmlFor={`pos-guest-${name}`}>{t(`customer.${name}`)}</Label>
      <Input
        id={`pos-guest-${name}`}
        type={type}
        value={guest[name]}
        aria-invalid={!!errors[name]}
        onChange={(e) => onChange({ ...guest, [name]: e.target.value })}
      />
      {errors[name] && (
        <p className='text-xs text-destructive'>{t(errors[name])}</p>
      )}
    </div>
  )

  return (
    <div className='grid gap-3 sm:grid-cols-2'>
      {field('name')}
      {field('phone', 'tel')}
      {field('email', 'email')}
      <div className='space-y-1 sm:col-span-2'>
        <Label htmlFor='pos-guest-address'>{t('customer.address')}</Label>
        <Textarea
          id='pos-guest-address'
          rows={2}
          value={guest.address}
          aria-invalid={!!errors.address}
          onChange={(e) => onChange({ ...guest, address: e.target.value })}
        />
        {errors.address && (
          <p className='text-xs text-destructive'>{t(errors.address)}</p>
        )}
      </div>
    </div>
  )
}
