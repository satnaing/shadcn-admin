import { RotateCcw, Search } from 'lucide-react'
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
import { type SellerFilterParams } from '../data/sellers.type'

interface SellerFilterBarProps {
  filters: SellerFilterParams
  onChange: (filters: SellerFilterParams) => void
  onReset: () => void
  hideApprovalFilter?: boolean
}

export function SellerFilterBar({
  filters,
  onChange,
  onReset,
  hideApprovalFilter = false,
}: SellerFilterBarProps) {
  const { t } = useTranslation('sellers')

  return (
    <div className='flex flex-wrap items-center gap-3'>
      <div className='relative flex-1 min-w-[200px] max-w-sm'>
        <Search className='absolute left-2.5 top-2.5 size-4 text-muted-foreground' />
        <Input
          placeholder={t('filter.searchPlaceholder', 'Mağaza, satıcı və ya telefon...')}
          value={filters.search ?? ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className='pl-8'
        />
      </div>

      {!hideApprovalFilter && (
        <Select
          value={filters.is_approved === undefined ? 'all' : String(filters.is_approved)}
          onValueChange={(val) =>
            onChange({
              ...filters,
              is_approved: val === 'all' ? 'all' : val === 'true',
            })
          }
        >
          <SelectTrigger className='w-[160px]'>
            <SelectValue placeholder={t('filter.allApproval', 'Təsdiq statusu')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>{t('filter.allApproval', 'Təsdiq statusu: Hamısı')}</SelectItem>
            <SelectItem value='true'>{t('status.approved', 'Təsdiqlənmiş')}</SelectItem>
            <SelectItem value='false'>{t('status.pending', 'Gözləyən')}</SelectItem>
          </SelectContent>
        </Select>
      )}

      <Select
        value={filters.is_verified === undefined ? 'all' : String(filters.is_verified)}
        onValueChange={(val) =>
          onChange({
            ...filters,
            is_verified: val === 'all' ? 'all' : val === 'true',
          })
        }
      >
        <SelectTrigger className='w-[160px]'>
          <SelectValue placeholder={t('filter.allVerification', 'Verifikasiya')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>{t('filter.allVerification', 'Verifikasiya: Hamısı')}</SelectItem>
          <SelectItem value='true'>{t('status.verified', 'Doğrulanmış')}</SelectItem>
          <SelectItem value='false'>{t('status.unverified', 'Doğrulanmamış')}</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.is_banned === undefined ? 'all' : String(filters.is_banned)}
        onValueChange={(val) =>
          onChange({
            ...filters,
            is_banned: val === 'all' ? 'all' : val === 'true',
          })
        }
      >
        <SelectTrigger className='w-[150px]'>
          <SelectValue placeholder={t('filter.allBan', 'Qadağa')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>{t('filter.allBan', 'Qadağa: Hamısı')}</SelectItem>
          <SelectItem value='false'>{t('status.active', 'Aktiv')}</SelectItem>
          <SelectItem value='true'>{t('status.banned', 'Ban edilmiş')}</SelectItem>
        </SelectContent>
      </Select>

      <Button variant='outline' size='icon' onClick={onReset} title={t('filter.reset', 'Sıfırla')}>
        <RotateCcw className='size-4' />
      </Button>
    </div>
  )
}
