import { useQueryClient } from '@tanstack/react-query'
import { getLocaleOption, LOCALE_OPTIONS } from '@/shared/constants/locales'
import type { Locale } from '@/shared/types'
import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useCurrentLanguage } from '@/hooks/useCurrentLanguage'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

function LocaleFlag({ flag, className }: { flag: string; className?: string }) {
  return (
    <span
      className={cn('text-base leading-none select-none', className)}
      aria-hidden
    >
      {flag}
    </span>
  )
}

export function LocaleSwitcher() {
  const { i18n, t } = useTranslation('common')
  const queryClient = useQueryClient()
  const currentLocale = useCurrentLanguage() as Locale
  const selected = getLocaleOption(currentLocale)

  const changeLanguage = async (lng: Locale) => {
    await i18n.changeLanguage(lng)
    await queryClient.invalidateQueries()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className='h-9 gap-2 rounded-lg px-2.5'
          aria-label={t('localeSwitcher.toggle')}
        >
          <LocaleFlag flag={selected.flag} />
          <span className='text-xs font-medium'>{selected.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='min-w-44'>
        {LOCALE_OPTIONS.map((option) => {
          const isActive = option.code === currentLocale

          return (
            <DropdownMenuItem
              key={option.code}
              onClick={() => changeLanguage(option.code)}
              className={cn(
                'cursor-pointer gap-2.5',
                isActive &&
                  'bg-primary/10 text-primary focus:bg-primary/10 focus:text-primary'
              )}
            >
              <LocaleFlag flag={option.flag} />
              <span className='flex-1 font-medium'>{option.label}</span>
              {isActive ? <Check className='size-4 text-primary' /> : null}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
