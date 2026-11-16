import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ORDER_SOURCES, type PosGuestInfo } from '../data/pos.type'
import type { PosCustomerState } from '../hooks/use-pos-customer'
import { PosAddressList } from './pos-address-list'
import { PosCustomerSearch } from './pos-customer-search'
import { PosGuestForm } from './pos-guest-form'

interface Props {
  state: PosCustomerState
  guestErrors: Partial<Record<keyof PosGuestInfo, string>>
}

/** Order source toggle (walk-in / registered / Facebook / WhatsApp) and the matching customer inputs. */
export function PosCustomerPanel({ state, guestErrors }: Props) {
  const { t } = useTranslation('pos')
  const { source, customer } = state

  return (
    <Card>
      <CardHeader className='pb-2'>
        <CardTitle className='text-base'>{t('customer.title')}</CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        <div role='tablist' className='grid grid-cols-2 gap-2'>
          {ORDER_SOURCES.map((s) => (
            <Button
              key={s}
              type='button'
              role='tab'
              size='sm'
              aria-selected={s === source}
              variant={s === source ? 'default' : 'outline'}
              onClick={() => state.setSource(s)}
            >
              {t(`source.${s}`)}
            </Button>
          ))}
        </div>
        {source !== 'registered' && (
          <PosGuestForm
            guest={state.guest}
            onChange={state.setGuest}
            errors={guestErrors}
          />
        )}
        {source === 'registered' && !customer && (
          <PosCustomerSearch onSelect={state.setCustomer} />
        )}
        {source === 'registered' && customer && (
          <>
            <div className='flex items-center justify-between rounded-md bg-muted p-2 text-sm'>
              <span>
                <span className='font-medium'>{customer.name}</span>
                <span className='ms-2 text-muted-foreground'>{customer.phone}</span>
              </span>
              <Button
                type='button'
                size='sm'
                variant='ghost'
                onClick={() => state.setCustomer(null)}
              >
                {t('customer.change')}
              </Button>
            </div>
            <PosAddressList
              customerId={customer.id}
              addressId={state.addressId}
              onSelect={state.setAddressId}
            />
          </>
        )}
      </CardContent>
    </Card>
  )
}
