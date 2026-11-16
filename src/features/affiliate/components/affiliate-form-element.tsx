import { type Control, useWatch, type UseFormReturn } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { FormInputField } from '@/components/forms/form-input-field'
import { FormSelectField } from '@/components/forms/form-select-field'
import type { RegistrationFormValues } from '../data/affiliate.schema'
import { CHOICE_TYPES, ELEMENT_TYPES } from '../data/affiliate.type'

interface Props {
  form: UseFormReturn<RegistrationFormValues>
  index: number
  onRemove: () => void
}

/** One field of the applicant form: its type, label and (for select / radio types) the choices. */
export function AffiliateFormElement({ form, index, onRemove }: Props) {
  const { t } = useTranslation('affiliate')
  const control = form.control as Control<RegistrationFormValues>
  const type = useWatch({ control, name: `elements.${index}.type` })
  const options = useWatch({ control, name: `elements.${index}.options` }) ?? []
  const error = form.formState.errors.elements?.[index]?.options
  const setOptions = (next: string[]) =>
    form.setValue(`elements.${index}.options`, next, { shouldDirty: true })
  const hasChoices = CHOICE_TYPES.includes(type as never)

  return (
    <Card>
      <CardContent className='space-y-4 pt-6'>
        <div className='grid gap-3 sm:grid-cols-[12rem_1fr_auto] sm:items-start'>
          <FormSelectField
            form={form}
            name={`elements.${index}.type`}
            label={t('form.type')}
            options={ELEMENT_TYPES.map((value) => ({
              value,
              label: t(`form.types.${value}`),
            }))}
          />
          <FormInputField
            form={form}
            name={`elements.${index}.label`}
            label={t('form.label')}
          />
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='sm:mt-8'
            aria-label={t('form.remove')}
            onClick={onRemove}
          >
            <Trash2 className='size-4 text-destructive' />
          </Button>
        </div>
        {hasChoices && (
          <div className='space-y-2'>
            <p className='text-sm font-medium'>{t('form.options')}</p>
            {options.map((value, i) => (
              <div key={i} className='flex gap-2'>
                <Input
                  value={value}
                  aria-label={t('form.option', { n: i + 1 })}
                  onChange={(e) =>
                    setOptions(
                      options.map((o, j) => (j === i ? e.target.value : o))
                    )
                  }
                />
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  aria-label={t('form.removeOption')}
                  onClick={() => setOptions(options.filter((_, j) => j !== i))}
                >
                  <Trash2 className='size-4' />
                </Button>
              </div>
            ))}
            <Button
              type='button'
              size='sm'
              variant='outline'
              onClick={() => setOptions([...options, ''])}
            >
              <Plus className='me-2 size-4' />
              {t('form.addOption')}
            </Button>
            {error?.message && (
              <p className='text-sm text-destructive'>{t(error.message)}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
