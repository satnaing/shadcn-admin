import { Input } from '@/components/ui/input'
import { useTranslations } from 'use-intl'

export function Search() {
  const t = useTranslations('dashboard')
  return (
    <div>
      <Input
        type='search'
        placeholder={t('search')}
        className='md:w-[100px] lg:w-[300px]'
      />
    </div>
  )
}
