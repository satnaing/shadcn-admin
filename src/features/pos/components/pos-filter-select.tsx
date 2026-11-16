import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Props {
  value: string
  onChange: (value: string) => void
  allLabel: string
  options: { value: string; label: string }[]
}

/** Plain single filter with an "all" entry (Radix Select cannot hold an empty value). */
export function PosFilterSelect({ value, onChange, allLabel, options }: Props) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className='w-full' aria-label={allLabel}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='all'>{allLabel}</SelectItem>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
