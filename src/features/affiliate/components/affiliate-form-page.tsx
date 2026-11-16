import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import {
  type RegistrationFormValues,
  registrationFormSchema,
} from '../data/affiliate.schema'
import {
  CHOICE_TYPES,
  ELEMENT_TYPES,
  type ElementType,
  type FormElement,
} from '../data/affiliate.type'
import { useRegistrationForm } from '../hooks/use-affiliate'
import { useAffiliateMutations } from '../hooks/use-affiliate-mutations'
import { AffiliateFormElement } from './affiliate-form-element'

const blank = (type: ElementType): FormElement => ({
  type,
  label: '',
  options: CHOICE_TYPES.includes(type) ? [''] : [],
})

function FormBuilder({ elements }: { elements: FormElement[] }) {
  const { t } = useTranslation('affiliate')
  const { saveForm } = useAffiliateMutations()
  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: { elements },
  })
  const fields = useFieldArray({ control: form.control, name: 'elements' })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((v) =>
          saveForm.mutate(v.elements as FormElement[])
        )}
        className='space-y-4'
      >
        <div className='flex flex-wrap items-center gap-2'>
          <span className='text-sm text-muted-foreground'>
            {t('form.addField')}
          </span>
          {ELEMENT_TYPES.map((type) => (
            <Button
              key={type}
              type='button'
              size='sm'
              variant='outline'
              onClick={() => fields.append(blank(type))}
            >
              <Plus className='me-1 size-3.5' />
              {t(`form.types.${type}`)}
            </Button>
          ))}
        </div>
        {fields.fields.length === 0 && (
          <p className='text-sm text-muted-foreground'>{t('form.empty')}</p>
        )}
        {fields.fields.map((field, index) => (
          <AffiliateFormElement
            key={field.id}
            form={form}
            index={index}
            onRemove={() => fields.remove(index)}
          />
        ))}
        <div className='flex justify-end border-t pt-4'>
          <Button type='submit' disabled={saveForm.isPending}>
            {t(saveForm.isPending ? 'actions.saving' : 'actions.save')}
          </Button>
        </div>
      </form>
    </Form>
  )
}

/** The questions a visitor answers when applying to become an affiliate (AEC "registration form config"). */
export function AffiliateFormPage() {
  const { t } = useTranslation('affiliate')
  const { data } = useRegistrationForm()

  return (
    <AdminPageShell title={t('form.title')} description={t('form.description')}>
      {data ? (
        <FormBuilder elements={data.data} />
      ) : (
        <div aria-busy='true' className='h-40' />
      )}
    </AdminPageShell>
  )
}
