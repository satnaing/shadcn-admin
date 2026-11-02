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
import {
  type ClassifiedCondition,
  type ClassifiedCreatorType,
} from '../data/classified.type'

interface ClassifiedFilterBarProps {
  search: string
  onSearchChange: (val: string) => void
  creatorType: 'all' | ClassifiedCreatorType
  onCreatorTypeChange: (val: 'all' | ClassifiedCreatorType) => void
  condition: 'all' | ClassifiedCondition
  onConditionChange: (val: 'all' | ClassifiedCondition) => void
  hideCreatorFilter?: boolean
}

export function ClassifiedFilterBar({
  search,
  onSearchChange,
  creatorType,
  onCreatorTypeChange,
  condition,
  onConditionChange,
  hideCreatorFilter = false,
}: ClassifiedFilterBarProps) {
  const { t } = useTranslation('classified')

  return (
    <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
      <div className='relative flex-1 max-w-sm'>
        <Search className='absolute left-2.5 top-2.5 size-4 text-muted-foreground' />
        <Input
          placeholder={t('filter.searchPlaceholder', 'Elan və ya yaradan axtar...')}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className='pl-8'
        />
      </div>

      {!hideCreatorFilter && (
        <Select value={creatorType} onValueChange={(val) => onCreatorTypeChange(val as 'all' | ClassifiedCreatorType)}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder={t('filter.allCreators', 'Bütün Növlər')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>{t('filter.allCreators', 'Bütün Növlər')}</SelectItem>
            <SelectItem value='admin'>{t('types.admin', 'Admin (In-House)')}</SelectItem>
            <SelectItem value='seller'>{t('types.seller', 'Satıcı')}</SelectItem>
          </SelectContent>
        </Select>
      )}

      <Select value={condition} onValueChange={(val) => onConditionChange(val as 'all' | ClassifiedCondition)}>
        <SelectTrigger className='w-[160px]'>
          <SelectValue placeholder={t('filter.allConditions', 'Bütün Vəziyyətlər')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>{t('filter.allConditions', 'Bütün Vəziyyətlər')}</SelectItem>
          <SelectItem value='new'>{t('condition.new', 'Yeni')}</SelectItem>
          <SelectItem value='used'>{t('condition.used', 'İşlənmiş')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
