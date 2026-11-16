import { Plus, Trash2 } from 'lucide-react'
import { type UseFormReturn, useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormInputField } from '@/components/forms/form-input-field'
import { Button } from '@/components/ui/button'
import { emptyBankRow, type ManualFormValues } from '../data/payments.schema'

/** Repeatable bank accounts of a `bank_payment` method (AEC "Add New" JS cloned the row HTML). */
export function PaymentsBankRows({ form }: { form: UseFormReturn<ManualFormValues> }) {
  const { t } = useTranslation('payments')
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'bank_info' })
  const error = form.formState.errors.bank_info?.message

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <h4 className='text-sm font-semibold'>{t('manual.form.banks')}</h4>
        <Button type='button' size='sm' variant='outline' onClick={() => append(emptyBankRow)}>
          <Plus className='me-1 size-4' />
          {t('manual.form.addBank')}
        </Button>
      </div>
      {error && <p className='text-sm text-destructive'>{t(error.replace(/^payments:/, ''))}</p>}
      {fields.map((row, i) => (
        <div key={row.id} className='grid gap-3 rounded-md border p-3 sm:grid-cols-2'>
          <FormInputField form={form} name={`bank_info.${i}.bank_name`} label={t('manual.form.bankName')} />
          <FormInputField form={form} name={`bank_info.${i}.account_name`} label={t('manual.form.accountName')} />
          <FormInputField form={form} name={`bank_info.${i}.account_number`} label={t('manual.form.accountNumber')} />
          <div className='flex items-end gap-2'>
            <FormInputField
              form={form}
              name={`bank_info.${i}.routing_number`}
              label={t('manual.form.routingNumber')}
              className='flex-1'
            />
            <Button type='button' size='icon' variant='ghost' aria-label={t('actions.remove')} onClick={() => remove(i)}>
              <Trash2 className='size-4' />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
