import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface ReportFilterBarProps {
  search: string
  onSearchChange: (v: string) => void
  placeholder?: string
  startDate?: string
  onStartDateChange?: (v: string) => void
  endDate?: string
  onEndDateChange?: (v: string) => void
  children?: React.ReactNode
}

export function ReportFilterBar({
  search,
  onSearchChange,
  placeholder = 'Axtar...',
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  children,
}: ReportFilterBarProps) {
  return (
    <div className='flex flex-wrap items-center gap-3 rounded-lg border bg-card p-4'>
      <div className='relative min-w-[220px] flex-1'>
        <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className='pl-9'
        />
      </div>

      {onStartDateChange && (
        <Input
          type='date'
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className='w-auto text-xs'
        />
      )}

      {onEndDateChange && (
        <Input
          type='date'
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className='w-auto text-xs'
        />
      )}

      {children}
    </div>
  )
}
