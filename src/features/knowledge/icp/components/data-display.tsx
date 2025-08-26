import { type LucideIcon } from 'lucide-react'

interface DataDisplayProps {
  icon: LucideIcon
  label: string
}

export default function DataDisplay({ icon: Icon, label }: DataDisplayProps) {
  return (
    <div className='flex items-center gap-1'>
      <Icon className='text-muted-foreground h-4 w-4' />
      <span className='text-sm'>{label}</span>
    </div>
  )
}
