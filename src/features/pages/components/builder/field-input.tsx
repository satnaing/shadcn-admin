import { RichTextEditor } from '@/components/shared/rich-text/rich-text-editor'
import { useTranslation } from 'react-i18next'
import { ImagePicker } from '@/components/image-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { type FieldDef, fieldsOf, readText, writeText } from '../../data/payload-schema'
import { ListField } from './list-field'
import { SourceField } from './source-field'

export interface FieldInputProps {
  def: FieldDef
  value: unknown
  onChange: (value: unknown) => void
  lang: string
}

const asText = (value: unknown) => (typeof value === 'string' || typeof value === 'number' ? String(value) : '')

export function FieldInput({ def, value, onChange, lang }: FieldInputProps) {
  const { t } = useTranslation('pages')
  const { widget, node } = def
  const id = `f-${def.key}`
  const text = def.localized ? readText(value, lang) : asText(value)
  const setText = (next: string) => onChange(def.localized ? writeText(value, lang, next) : next)

  if (widget === 'list') return <ListField def={def} value={value} onChange={onChange} lang={lang} />
  if (widget === 'source') return <SourceField def={def} value={value} onChange={onChange} />
  if (widget === 'group') {
    const current = (typeof value === 'object' && value !== null ? value : {}) as Record<string, unknown>
    return (
      <fieldset className='space-y-3 rounded-md border p-3'>
        <legend className='px-1 text-sm font-medium'>{def.label}</legend>
        {fieldsOf(node.properties).map((field) => (
          <FieldInput key={field.key} def={field} lang={lang} value={current[field.key]} onChange={(next) => onChange({ ...current, [field.key]: next })} />
        ))}
      </fieldset>
    )
  }

  return (
    <div className='space-y-1.5'>
      <Label htmlFor={id} className='flex items-center gap-2'>
        {def.label}
        {def.localized ? <span className='rounded bg-muted px-1 text-[10px] uppercase'>{lang}</span> : null}
      </Label>
      {widget === 'richtext' ? (
        <RichTextEditor id={id} value={text} onChange={setText} />
      ) : widget === 'textarea' ? (
        <Textarea id={id} rows={3} value={text} onChange={(e) => setText(e.target.value)} />
      ) : widget === 'number' ? (
        <Input id={id} type='number' value={asText(value)} onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))} />
      ) : widget === 'switch' ? (
        <div><Switch id={id} checked={value === true} onCheckedChange={onChange} /></div>
      ) : widget === 'select' ? (
        <Select value={asText(value)} onValueChange={onChange}>
          <SelectTrigger id={id} className='w-full'><SelectValue placeholder={t('fields.choose')} /></SelectTrigger>
          <SelectContent>
            {(node.enum ?? []).map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
          </SelectContent>
        </Select>
      ) : widget === 'image' ? (
        <ImagePicker id={id} value={asText(value)} onChange={onChange} />
      ) : widget === 'color' ? (
        <div className='flex gap-2'>
          <Input aria-label={def.label} type='color' className='w-12 p-1' value={asText(value) || '#ffffff'} onChange={(e) => onChange(e.target.value)} />
          <Input id={id} value={asText(value)} onChange={(e) => onChange(e.target.value)} />
        </div>
      ) : (
        <Input id={id} placeholder={widget === 'link' ? t('fields.linkHint') : undefined} value={text} onChange={(e) => setText(e.target.value)} />
      )}
    </div>
  )
}
