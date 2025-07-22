import { IconCheck } from '@tabler/icons-react'
import { PilcrowLeftIcon, PilcrowRightIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDirection } from '@/context/direction-context'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function DirSwitch() {
  const { dir, setDir } = useDirection()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='scale-95 rounded-full'>
          <PilcrowLeftIcon className='size-[1.2rem] scale-100 rotate-0 transition-all rtl:scale-0 rtl:-rotate-90' />
          <PilcrowRightIcon className='absolute size-[1.2rem] scale-0 rotate-90 transition-all rtl:scale-100 rtl:rotate-0' />
          <span className='sr-only'>Toggle Site Direction</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => setDir('ltr')}>
          Left to Right (LTR)
          <IconCheck
            size={14}
            className={cn('ms-auto', dir !== 'ltr' && 'hidden')}
          />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setDir('rtl')}>
          Right to Left (RTL)
          <IconCheck
            size={14}
            className={cn('ms-auto', dir !== 'rtl' && 'hidden')}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
