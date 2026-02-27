import * as React from 'react'
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/config/locales'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface MultiLangInputProps {
  value: Record<string, string>
  onChange: (value: Record<string, string>) => void
  label?: string
  placeholder?: string | Record<string, string>
  className?: string
}

export function MultiLangInput({
  value = {},
  onChange,
  label,
  placeholder,
  className,
}: MultiLangInputProps) {
  const [currentTab, setCurrentTab] = React.useState<string>(DEFAULT_LOCALE)

  const handleInputChange = (text: string) => {
    onChange({
      ...value,
      [currentTab]: text,
    })
  }

  const currentValue = value[currentTab] || ''

  return (
    <div className={cn('space-y-2', className)}>
      <div className='flex items-center justify-between'>
        {label && <Label>{label}</Label>}
        <Tabs
          value={currentTab}
          onValueChange={setCurrentTab}
          className='w-auto'
        >
          <TabsList className='h-7 p-0.5'>
            {SUPPORTED_LOCALES.map((locale) => (
              <TabsTrigger
                key={locale.code}
                value={locale.code}
                className='relative h-6 px-2 text-xs'
              >
                <span className='mr-1'>{locale.flag}</span>
                {locale.code.toUpperCase()}
                {value[locale.code] && value[locale.code].trim() !== '' && (
                  <span className='absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-green-500' />
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <Input
        autoComplete='off'
        value={currentValue}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder={(() => {
          if (!placeholder) return undefined
          const basePlaceholder =
            typeof placeholder === 'string'
              ? placeholder
              : placeholder[currentTab] || placeholder[DEFAULT_LOCALE] || ''
          return `${basePlaceholder} (${SUPPORTED_LOCALES.find((l) => l.code === currentTab)?.label})`
        })()}
      />
    </div>
  )
}
