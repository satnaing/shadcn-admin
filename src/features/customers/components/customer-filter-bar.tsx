import { Search, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { type CustomerFilterParams } from '../data/customers.type'

interface CustomerFilterBarProps {
  filters: CustomerFilterParams
  onChange: (filters: CustomerFilterParams) => void
  onReset: () => void
  hideVerificationFilter?: boolean
}

export function CustomerFilterBar({
  filters,
  onChange,
  onReset,
  hideVerificationFilter = false,
}: CustomerFilterBarProps) {
  const { t } = useTranslation('customers')

  return (
    <div className='flex flex-wrap items-center gap-3 py-2'>
      <div className='relative min-w-[220px] flex-1 max-w-sm'>
        <Search className='absolute left-2.5 top-2.5 size-4 text-muted-foreground' />
        <Input
          placeholder={t('filter.searchPlaceholder', 'Ad, email və ya telefon...')}
          value={filters.search ?? ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value, page: 1 })}
          className='pl-8'
        />
      </div>

      {!hideVerificationFilter && (
        <Select
          value={filters.is_verified === undefined ? 'all' : String(filters.is_verified)}
          onValueChange={(val) =>
            onChange({
              ...filters,
              is_verified: val === 'all' ? 'all' : val === 'true',
              page: 1,
            })
          }
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder={t('filter.verification', 'Verifikasiya statusu')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>{t('filter.all', 'Bütün müştərilər')}</SelectItem>
            <SelectItem value='true'>{t('filter.verified', 'Təsdiqlənmiş')}</SelectItem>
            <SelectItem value='false'>{t('filter.unverified', 'Təsdiqlənməmiş')}</SelectItem>
          </SelectContent>
        </Select>
      )}

      <Select
        value={filters.is_banned === undefined ? 'all' : String(filters.is_banned)}
        onValueChange={(val) =>
          onChange({
            ...filters,
            is_banned: val === 'all' ? 'all' : val === 'true',
            page: 1,
          })
        }
      >
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder={t('filter.banStatus', 'Hesab statusu')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>{t('filter.allAccounts', 'Bütün hesablar')}</SelectItem>
          <SelectItem value='false'>{t('filter.active', 'Aktiv')}</SelectItem>
          <SelectItem value='true'>{t('filter.banned', 'Bloklanmış')}</SelectItem>
        </SelectContent>
      </Select>

      {(filters.search ||
        (filters.is_verified !== undefined && filters.is_verified !== 'all') ||
        (filters.is_banned !== undefined && filters.is_banned !== 'all')) && (
        <Button
          variant='ghost'
          size='sm'
          onClick={onReset}
          className='text-muted-foreground hover:text-foreground'
        >
          <X className='mr-1.5 size-4' />
          {t('filter.reset', 'Sıfırla')}
        </Button>
      )}
    </div>
  )
}
