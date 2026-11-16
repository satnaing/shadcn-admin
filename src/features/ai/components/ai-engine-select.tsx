import { useTranslation } from 'react-i18next'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { TranslateEngine } from '../data/ai.type'

const ENGINES: TranslateEngine[] = ['ai', 'google']

interface Props {
  value: TranslateEngine
  onChange: (engine: TranslateEngine) => void
  disabled: boolean
}

export function AiEngineSelect({ value, onChange, disabled }: Props) {
  const { t } = useTranslation('ai')

  return (
    <div className='max-w-xs space-y-2'>
      <Label htmlFor='ai-engine'>{t('translate.engine')}</Label>
      <Select value={value} onValueChange={(v) => onChange(v as TranslateEngine)} disabled={disabled}>
        <SelectTrigger id='ai-engine' className='w-full'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ENGINES.map((e) => (
            <SelectItem key={e} value={e}>
              {t(`translate.engines.${e}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className='text-sm text-muted-foreground'>{t(`translate.engineHint.${value}`)}</p>
    </div>
  )
}
