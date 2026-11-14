import { Button } from '@/components/ui/button'
import { FALLBACK_FORM_LOCALES } from '@/shared/constants/locales'

interface LocaleSwitchProps {
  value: string
  onChange: (locale: string) => void
}

/** Content language being edited (not the admin UI language). */
export function LocaleSwitch({ value, onChange }: LocaleSwitchProps) {
  return (
    <div className='flex gap-1' role='tablist'>
      {FALLBACK_FORM_LOCALES.map((code) => (
        <Button
          key={code}
          type='button'
          role='tab'
          aria-selected={value === code}
          size='sm'
          variant={value === code ? 'default' : 'outline'}
          onClick={() => onChange(code)}
        >
          {code.toUpperCase()}
        </Button>
      ))}
    </div>
  )
}
