import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export type ModuleFilter = 'all' | 'active' | 'inactive' | 'notInstalled'
const FILTERS: ModuleFilter[] = ['all', 'active', 'inactive', 'notInstalled']

interface Props {
  search: string
  onSearch: (value: string) => void
  filter: ModuleFilter
  onFilter: (value: ModuleFilter) => void
}

export function ModulesToolbar({ search, onSearch, filter, onFilter }: Props) {
  const { t } = useTranslation('modules')

  return (
    <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
      <Tabs value={filter} onValueChange={(v) => onFilter(v as ModuleFilter)}>
        <TabsList>
          {FILTERS.map((f) => (
            <TabsTrigger key={f} value={f}>
              {t(`filter.${f}`)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <Input
        className='sm:w-64'
        value={search}
        placeholder={t('search')}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  )
}
