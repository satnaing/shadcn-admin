import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useThemeT } from '../hooks/useThemeT'

export const ALL = 'all'

interface FilterSelectProps {
  value: string
  onChange: (value: string) => void
  options: string[]
  label: string
}

export function FilterSelect({ value, onChange, options, label }: FilterSelectProps) {
  const t = useThemeT()

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-label={label} className='w-40'>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>{t('common.all')}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
