import { type Control, Controller, type FieldErrors, type UseFormRegister } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import type { FieldDef, GroupValues, SettingsGroup } from '../data/settings.type'

interface SettingsFieldProps {
  group: SettingsGroup
  def: FieldDef
  control: Control<GroupValues>
  register: UseFormRegister<GroupValues>
  errors: FieldErrors<GroupValues>
}

export function SettingsField({ group, def, control, register, errors }: SettingsFieldProps) {
  const { t } = useTranslation('settings')
  const id = `${group}-${def.name}`
  const label = t(`${group}.fields.${def.name}`)
  const invalid = Boolean(errors[def.name])

  if (def.type === 'switch') {
    return (
      <div className='flex items-center justify-between gap-4 rounded-md border p-3'>
        <Label htmlFor={id}>{label}</Label>
        <Controller
          control={control}
          name={def.name}
          render={({ field }) => (
            <Switch id={id} checked={field.value === true} onCheckedChange={field.onChange} />
          )}
        />
      </div>
    )
  }

  return (
    <div className='space-y-2'>
      <Label htmlFor={id}>{label}</Label>
      {def.type === 'select' ? (
        <Controller
          control={control}
          name={def.name}
          render={({ field }) => (
            <Select value={String(field.value ?? '')} onValueChange={field.onChange}>
              <SelectTrigger id={id} className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {def.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {t(`${group}.options.${option}`, { defaultValue: option })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      ) : def.type === 'textarea' ? (
        <Textarea id={id} rows={3} aria-invalid={invalid} {...register(def.name)} />
      ) : (
        <Input
          id={id}
          type={def.type}
          autoComplete={def.type === 'password' ? 'new-password' : undefined}
          aria-invalid={invalid}
          {...register(def.name, { valueAsNumber: def.type === 'number' })}
        />
      )}
      {invalid && <p className='text-sm text-destructive'>{t('common.invalid')}</p>}
    </div>
  )
}
