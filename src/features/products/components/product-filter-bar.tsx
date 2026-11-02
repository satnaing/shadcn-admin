import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ProductFilterBarProps {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  sortBy: string
  onSortByChange: (value: string) => void
}

export function ProductFilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
}: ProductFilterBarProps) {
  const { t } = useTranslation('products')

  return (
    <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
      <div className='relative w-full max-w-sm'>
        <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
        <Input
          placeholder={t('filter.searchPlaceholder', 'Məhsul axtarışı...')}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className='pl-9'
        />
      </div>

      <div className='flex flex-wrap items-center gap-2'>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className='w-[160px]'>
            <SelectValue placeholder={t('filter.status', 'Status')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>{t('filter.all', 'Bütün statuslar')}</SelectItem>
            <SelectItem value='published'>{t('filter.published', 'Dərc edilmiş')}</SelectItem>
            <SelectItem value='low_stock'>{t('filter.lowStock', 'Azalan stok')}</SelectItem>
            <SelectItem value='todays_deal'>{t('filter.todaysDeal', 'Günün təklifi')}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger className='w-[170px]'>
            <SelectValue placeholder={t('filter.sortBy', 'Çeşidləmə')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='id_desc'>{t('filter.newest', 'Ən yenilər')}</SelectItem>
            <SelectItem value='price_asc'>{t('filter.priceAsc', 'Qiymət: Artan')}</SelectItem>
            <SelectItem value='price_desc'>{t('filter.priceDesc', 'Qiymət: Azalan')}</SelectItem>
            <SelectItem value='rating_desc'>{t('filter.ratingDesc', 'Ən yüksək reytinq')}</SelectItem>
            <SelectItem value='sales_desc'>{t('filter.salesDesc', 'Ən çox satılanlar')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
