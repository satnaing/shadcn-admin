import { Check, Palette } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useColorTheme } from '@/hooks/use-color-theme'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ColorPicker() {
  const { t } = useTranslation('common')
  const { activeColor, setColor, presets } = useColorTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='rounded-full'>
          <Palette size={20} />
          <span className='sr-only'>{t('themeColor')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56 md:w-64'>
        <div className='grid grid-cols-1 gap-1 p-1 md:grid-cols-2'>
          {presets.map((preset) => (
            <DropdownMenuItem
              key={preset.value}
              onClick={() => setColor(preset.value)}
              className='flex cursor-pointer items-center justify-between'
            >
              <div className='flex items-center gap-2'>
                <div className={cn('size-4 rounded-full', preset.class)} />
                <span className='text-sm'>{preset.name}</span>
              </div>
              {activeColor === preset.value && <Check size={16} />}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
