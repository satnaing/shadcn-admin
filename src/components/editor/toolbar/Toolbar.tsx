import { LucideIcon, Undo2Icon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ToolbarButtonProps {
  onClick?: () => void
  isActive?: boolean
  icon: LucideIcon
}

const ToolbarButton = ({
  onClick,
  isActive,
  icon: Icon,
}: ToolbarButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex h-7 min-w-7 items-center justify-center rounded-sm text-sm transition-all duration-200 ease-in-out hover:bg-neutral-200/80',
        isActive && 'bg-neutral-200/80'
      )}
    >
      <Icon />
    </button>
  )
}

export const Toolbar = () => {
  const sections: {
    label: string
    icon: LucideIcon
    onClick: () => void
    isActive?: boolean
  }[][] = [
    [
      {
        label: 'Undo',
        icon: Undo2Icon,
        onClick: () => {},
        isActive: false,
      },
    ],
  ]

  return (
    <div className='flex min-h-[40px] items-center gap-x-0.5 overflow-x-auto rounded-[24px] bg-[#f1f4f9] px-2.5 py-0.5'>
      {sections[0].map((section) => (
        <ToolbarButton
          key={section.label}
          onClick={section.onClick}
          isActive={section.isActive}
          icon={section.icon}
        />
      ))}
    </div>
  )
}
