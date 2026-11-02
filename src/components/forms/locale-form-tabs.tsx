import type { ReactNode } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useActiveLanguages } from '@/shared/hooks/useActiveLanguages'
import type { Locale } from '@/shared/types'

interface LocaleFormTabsProps {
  /** Override API default; usually omit so is_default wins. */
  defaultLocale?: Locale
  /** Controlled active tab (sync AI source locale, etc.). */
  value?: Locale
  onValueChange?: (locale: Locale) => void
  /** Rendered once between the tab list and locale field panels. */
  toolbar?: ReactNode
  children: (locale: Locale) => ReactNode
}

export function LocaleFormTabs({
  defaultLocale: defaultLocaleProp,
  value,
  onValueChange,
  toolbar,
  children,
}: LocaleFormTabsProps) {
  const { locales, defaultLocale, isLoading } = useActiveLanguages()
  const activeDefault = defaultLocaleProp ?? defaultLocale

  if (isLoading && locales.length === 0) {
    return (
      <p className='text-sm text-muted-foreground'>Loading languages…</p>
    )
  }

  const handleValueChange = (next: string) => {
    onValueChange?.(next as Locale)
  }

  return (
    <Tabs
      {...(value !== undefined
        ? { value, onValueChange: handleValueChange }
        : { defaultValue: activeDefault, onValueChange: handleValueChange })}
      className='space-y-4'
    >
      <TabsList className='h-10 w-full rounded-md p-1'>
        {locales.map((locale) => (
          <TabsTrigger
            key={locale}
            value={locale}
            className='rounded-sm! px-3 py-1.5 data-[state=active]:border-primary/40 data-[state=active]:font-semibold dark:data-[state=active]:border-primary/50'
          >
            {locale.toLocaleUpperCase()}
          </TabsTrigger>
        ))}
      </TabsList>

      {toolbar}

      {locales.map((locale) => (
        <TabsContent key={locale} value={locale} className='space-y-4'>
          {children(locale)}
        </TabsContent>
      ))}
    </Tabs>
  )
}
