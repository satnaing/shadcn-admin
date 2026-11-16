import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { EntityFormDialog } from '@/components/forms/entity-form-dialog'
import { FormInputField } from '@/components/forms/form-input-field'
import { FormTextareaField } from '@/components/forms/form-textarea-field'
import {
  type FaqFormValues,
  faqSchema,
  faqToForm,
} from '../data/preorder.schema'
import type { FaqItem } from '../data/preorder.type'
import { usePreorderMutations } from '../hooks/use-preorder-mutations'
import { PreorderLocaleTabs } from './preorder-locale-tabs'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** FAQ being edited; `undefined` = create. Remount with `key`. */
  faq?: FaqItem
}

export function PreorderFaqDialog({ open, onOpenChange, faq }: Props) {
  const { t } = useTranslation('preorder')
  const { createFaq, updateFaq } = usePreorderMutations()
  const form = useForm<FaqFormValues>({
    resolver: zodResolver(faqSchema),
    defaultValues: faqToForm(faq),
  })
  const mutation = faq ? updateFaq : createFaq
  const submit = form.handleSubmit((values) => {
    const onSuccess = () => onOpenChange(false)
    if (faq) updateFaq.mutate({ id: faq.id, values }, { onSuccess })
    else createFaq.mutate(values, { onSuccess })
  })

  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      form={form}
      title={t(faq ? 'faqs.form.editTitle' : 'faqs.form.createTitle')}
      description={t('faqs.form.description')}
      isCreate={!faq}
      isPending={mutation.isPending}
      labels={{
        saving: t('actions.saving'),
        saveAndExit: t('actions.save'),
        updating: t('actions.saving'),
        updateAndExit: t('actions.save'),
      }}
      onSubmit={submit}
      contentClassName='sm:max-w-xl'
    >
      <PreorderLocaleTabs>
        {(l) => (
          <>
            <FormInputField
              form={form}
              name={`translations.${l}.question`}
              label={t('faqs.form.question')}
            />
            <FormTextareaField
              form={form}
              name={`translations.${l}.answer`}
              label={t('faqs.form.answer')}
              rows={5}
            />
          </>
        )}
      </PreorderLocaleTabs>
    </EntityFormDialog>
  )
}
