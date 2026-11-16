import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTopProducts } from '../hooks/use-preorder'

const OWNERS = ['all', 'inhouse', 'seller'] as const

/** Top-selling preorder products; the owner filter is a server param (AEC loads it with an AJAX partial). */
export function PreorderTopProducts() {
  const { t } = useTranslation('preorder')
  const [owner, setOwner] = useState<(typeof OWNERS)[number]>('all')
  const { data } = useTopProducts(owner)
  const items = data?.data ?? []

  return (
    <Card>
      <CardHeader className='flex-row items-center justify-between'>
        <CardTitle>{t('dashboard.topProducts')}</CardTitle>
        <div className='flex gap-1'>
          {OWNERS.map((o) => (
            <Button
              key={o}
              size='sm'
              variant={o === owner ? 'default' : 'ghost'}
              onClick={() => setOwner(o)}
            >
              {t(`products.owner.${o}`)}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className='space-y-3'>
        {items.length === 0 && (
          <p className='py-6 text-center text-sm text-muted-foreground'>
            {t('dashboard.noSales')}
          </p>
        )}
        {items.map((p) => (
          <div key={p.id} className='flex items-center gap-3'>
            <img
              src={p.image}
              alt=''
              loading='lazy'
              width={36}
              height={36}
              className='size-9 rounded border object-cover'
            />
            <span className='line-clamp-1 flex-1'>{p.name}</span>
            <span className='text-sm text-muted-foreground'>
              {t('dashboard.sold', { count: p.quantity })}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
