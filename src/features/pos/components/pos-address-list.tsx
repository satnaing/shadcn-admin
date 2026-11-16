import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { usePosAddresses } from '../hooks/use-pos'
import { PosAddressDialog } from './pos-address-dialog'

interface Props {
  customerId: number
  addressId: number | null
  onSelect: (id: number) => void
}

/** Saved addresses of the registered customer; the order ships to the selected one. */
export function PosAddressList({ customerId, addressId, onSelect }: Props) {
  const { t } = useTranslation('pos')
  const [open, setOpen] = useState(false)
  const addresses = usePosAddresses(customerId).data?.data ?? []

  return (
    <div className='space-y-2'>
      {addresses.length === 0 && (
        <p className='text-sm text-muted-foreground'>{t('address.none')}</p>
      )}
      <RadioGroup
        value={addressId ? String(addressId) : ''}
        onValueChange={(v) => onSelect(Number(v))}
      >
        {addresses.map((a) => (
          <div key={a.id} className='flex items-start gap-2 rounded-md border p-2'>
            <RadioGroupItem
              value={String(a.id)}
              id={`pos-address-${a.id}`}
              className='mt-1'
            />
            <Label
              htmlFor={`pos-address-${a.id}`}
              className='block cursor-pointer font-normal'
            >
              {a.address}, {a.city}, {a.state}, {a.country}
              <span className='block text-xs text-muted-foreground'>
                {a.postal_code} · {a.phone}
              </span>
            </Label>
          </div>
        ))}
      </RadioGroup>
      <Button
        type='button'
        variant='outline'
        size='sm'
        onClick={() => setOpen(true)}
      >
        <Plus className='me-1 size-4' />
        {t('address.add')}
      </Button>
      {open && (
        <PosAddressDialog
          open
          onOpenChange={setOpen}
          customerId={customerId}
          onCreated={onSelect}
        />
      )}
    </div>
  )
}
