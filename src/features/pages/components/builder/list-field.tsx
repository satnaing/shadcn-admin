import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { type FieldDef, emptyValue, fieldsOf } from '../../data/payload-schema'
import { FieldInput, type FieldInputProps } from './field-input'

const asRows = (value: unknown): unknown[] => (Array.isArray(value) ? value : [])

/** Repeater: object items render their own fields, primitive items render one input. */
export function ListField({ def, value, onChange, lang }: FieldInputProps) {
  const { t } = useTranslation('pages')
  const rows = asRows(value)
  const itemNode = def.node.items ?? { type: 'string' as const }
  const itemFields = itemNode.type === 'object' ? fieldsOf(itemNode.properties) : null
  const set = (next: unknown[]) => onChange(next)
  const swap = (from: number, to: number) => {
    if (to < 0 || to >= rows.length) return
    const next = [...rows]
    next.splice(to, 0, ...next.splice(from, 1))
    set(next)
  }
  const single: FieldDef = { key: def.key, label: def.label, widget: 'text', tab: def.tab, localized: itemNode['x-localized'] === true, node: itemNode }

  return (
    <div className='space-y-2'>
      <Label>{def.label} ({rows.length})</Label>
      {rows.map((row, index) => (
        <div key={index} className='space-y-2 rounded-md border p-3'>
          <div className='flex justify-end gap-1'>
            <Button type='button' size='icon' variant='ghost' aria-label={t('actions.up')} onClick={() => swap(index, index - 1)}><ArrowUp className='size-4' /></Button>
            <Button type='button' size='icon' variant='ghost' aria-label={t('actions.down')} onClick={() => swap(index, index + 1)}><ArrowDown className='size-4' /></Button>
            <Button type='button' size='icon' variant='ghost' aria-label={t('actions.delete')} onClick={() => set(rows.filter((_, i) => i !== index))}><Trash2 className='size-4' /></Button>
          </div>
          {itemFields ? (
            itemFields.map((field) => (
              <FieldInput
                key={field.key}
                def={field}
                lang={lang}
                value={(row as Record<string, unknown>)?.[field.key]}
                onChange={(next) => set(rows.map((r, i) => (i === index ? { ...(r as object), [field.key]: next } : r)))}
              />
            ))
          ) : (
            <FieldInput def={single} lang={lang} value={row} onChange={(next) => set(rows.map((r, i) => (i === index ? next : r)))} />
          )}
        </div>
      ))}
      <Button type='button' size='sm' variant='outline' onClick={() => set([...rows, emptyValue(itemNode)])}>
        <Plus className='me-1 size-4' />{t('actions.addItem')}
      </Button>
    </div>
  )
}
