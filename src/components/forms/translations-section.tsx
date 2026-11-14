import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

interface TranslationsSectionProps {
  namespace: string
  translationKeyPrefix?: string
  children: ReactNode
}

export function TranslationsSection({
  namespace,
  translationKeyPrefix = 'form',
  children,
}: TranslationsSectionProps) {
  const { t } = useTranslation(namespace)

  return (
    <div className='space-y-3'>
      <div>
        <h3 className='text-sm font-medium'>
          {t(`${translationKeyPrefix}.translations`)}
        </h3>
        <p className='text-xs text-muted-foreground'>
          {t(`${translationKeyPrefix}.translationsDescription`)}
        </p>
      </div>
      {children}
    </div>
  )
}
