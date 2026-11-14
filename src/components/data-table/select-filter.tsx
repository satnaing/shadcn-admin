import { type Column } from '@tanstack/react-table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type DataTableSelectFilterProps<TData, TValue> = {
  column?: Column<TData, TValue>
  title: string
  options: {
    label: string
    value: string
  }[]
}

export function DataTableSelectFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableSelectFilterProps<TData, TValue>) {
  const value = (column?.getFilterValue() as string | undefined) ?? 'all'

  return (
    <Select
      value={value}
      onValueChange={(next) => {
        column?.setFilterValue(next === 'all' ? undefined : next)
      }}
    >
      <SelectTrigger className='h-10 w-[140px]'>
        <SelectValue placeholder={title} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='all'>{title}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
