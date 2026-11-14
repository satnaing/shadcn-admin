import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { FALLBACK_FORM_LOCALES } from '@/shared/constants/locales'
import { useThemeT } from '../hooks/useThemeT'
import { BANNER_GROUPS } from '../data/banner-defaults'
import type { BannerDraft } from '../data/themes.type'
import { useBlockForm } from '../hooks/use-block-form'
import { ColorField } from './color-field'
import { ImageField } from './image-field'
import { LocalizedField } from './localized-field'
import { SelectField } from './select-field'
import { SwitchField } from './switch-field'
import { TextField } from './text-field'

const opts = (values: string[]) => values.map((value) => ({ value, label: value }))
const GROUPS = opts([...BANNER_GROUPS])
const TONES = opts(['', 'sage', 'blush', 'sky', 'lavender', 'amber'])

function LocaleVisibility() {
  const { value, set } = useBlockForm()
  const t = useThemeT()
  const current = (value as BannerDraft).locales

  return (
    <div className='space-y-1.5 sm:col-span-2'>
      <Label>{t('leaf.locales')}</Label>
      <div className='flex flex-wrap gap-4'>
        {FALLBACK_FORM_LOCALES.map((code) => (
          <label key={code} className='flex items-center gap-2 text-sm'>
            <Checkbox
              checked={current.includes(code)}
              onCheckedChange={(on) => set('locales', on ? [...current, code] : current.filter((c) => c !== code))}
            />
            {code.toUpperCase()}
          </label>
        ))}
      </div>
    </div>
  )
}

/** `lockedColors`: the active theme forbids free colours (senseihost token policy). */
export function BannerFields({ lockedColors }: { lockedColors: boolean }) {
  return (
    <div className='grid gap-3 sm:grid-cols-2'>
      <SelectField path='group' options={GROUPS} />
      <SwitchField path='enabled' />
      <ImageField path='image' />
      <TextField path='alt' />
      <LocalizedField path='badge' />
      <LocalizedField path='tag' />
      <LocalizedField path='eyebrow' />
      <LocalizedField path='title' />
      <LocalizedField path='subtitle' />
      <LocalizedField path='description' multiline />
      <LocalizedField path='ctaText' />
      <TextField path='ctaLink' />
      {!lockedColors && (
        <>
          <ColorField path='bgColor' />
          <SelectField path='tone' options={TONES} />
        </>
      )}
      <TextField path='price' />
      <TextField path='originalPrice' />
      <TextField path='starts_at' type='datetime-local' />
      <TextField path='ends_at' type='datetime-local' />
      <LocaleVisibility />
    </div>
  )
}
