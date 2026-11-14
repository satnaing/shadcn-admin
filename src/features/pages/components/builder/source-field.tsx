import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { FieldDef } from '../../data/payload-schema'
import { SOURCE_TYPES, type SourceType, type SourceValue } from '../../data/pages.type'

interface SourceFieldProps {
  def: FieldDef
  value: unknown
  onChange: (value: SourceValue) => void
}

const normalize = (value: unknown): SourceValue => {
  const raw = (typeof value === 'object' && value !== null ? value : {}) as Partial<SourceValue>
  return { type: SOURCE_TYPES.includes(raw.type as SourceType) ? (raw.type as SourceType) : 'manual', ids: raw.ids ?? '' }
}

/** shortcut: ids are typed as a comma list; a real entity picker needs the catalog APIs (Q-P3). */
export function SourceField({ def, value, onChange }: SourceFieldProps) {
  const { t } = useTranslation('pages')
  const source = normalize(value)

  return (
    <div className='space-y-2 rounded-md border p-3'>
      <Label>{def.label}</Label>
      <Select value={source.type} onValueChange={(type) => onChange({ ...source, type: type as SourceType })}>
        <SelectTrigger className='w-full' aria-label={t('source.type')}><SelectValue /></SelectTrigger>
        <SelectContent>
          {SOURCE_TYPES.map((type) => <SelectItem key={type} value={type}>{t(`source.${type}`)}</SelectItem>)}
        </SelectContent>
      </Select>
      <Input
        aria-label={t('source.ids')}
        placeholder={t('source.idsHint')}
        value={source.ids}
        disabled={source.type === 'manual'}
        onChange={(e) => onChange({ ...source, ids: e.target.value })}
      />
    </div>
  )
}
