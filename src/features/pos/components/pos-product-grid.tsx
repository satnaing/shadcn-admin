import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import type { PosStockItem } from '../data/pos.type'
import { usePosLookups, usePosStock } from '../hooks/use-pos'
import { PosFilterSelect } from './pos-filter-select'
import { PosProductCard } from './pos-product-card'

/** Terminal catalogue: debounced search (name or exact barcode) + category/brand filters, 16 cards per "Load more". */
export function PosProductGrid({ onAdd }: { onAdd: (stock: PosStockItem) => void }) {
  const { t } = useTranslation('pos')
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('all')
  const [brand, setBrand] = useState('all')
  const lookups = usePosLookups().data?.data
  const query = usePosStock({
    q: useDebouncedValue(q.trim()) || undefined,
    category: category === 'all' ? undefined : category,
    brand: brand === 'all' ? undefined : brand,
  })
  const items = query.data?.pages.flatMap((p) => p.data) ?? []

  return (
    <div className='space-y-3'>
      <div className='grid gap-2 sm:grid-cols-3'>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t('grid.search')}
          aria-label={t('grid.search')}
        />
        <PosFilterSelect
          value={category}
          onChange={setCategory}
          allLabel={t('grid.allCategories')}
          options={(lookups?.categories ?? []).map((c) => ({
            value: String(c.id),
            label: `${'— '.repeat(c.depth)}${c.name}`,
          }))}
        />
        <PosFilterSelect
          value={brand}
          onChange={setBrand}
          allLabel={t('grid.allBrands')}
          options={(lookups?.brands ?? []).map((b) => ({ value: String(b.id), label: b.name }))}
        />
      </div>
      {items.length === 0 && !query.isFetching ? (
        <p className='py-10 text-center text-sm text-muted-foreground'>{t('grid.empty')}</p>
      ) : (
        <div className='grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4'>
          {items.map((stock) => (
            <PosProductCard key={stock.id} stock={stock} onAdd={onAdd} />
          ))}
        </div>
      )}
      {query.hasNextPage && (
        <div className='flex justify-center'>
          <Button variant='outline' disabled={query.isFetchingNextPage} onClick={() => query.fetchNextPage()}>
            {t(query.isFetchingNextPage ? 'grid.loading' : 'grid.loadMore')}
          </Button>
        </div>
      )}
    </div>
  )
}
