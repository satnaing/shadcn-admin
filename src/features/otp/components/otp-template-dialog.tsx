import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { EntityFormDialog } from '@/components/forms/entity-form-dialog'
import { FormInputField } from '@/components/forms/form-input-field'
import { FormSwitchField } from '@/components/forms/form-switch-field'
import { FormTextareaField } from '@/components/forms/form-textarea-field'
import { type TemplateFormValues, placeholders, templateSchema } from '../data/otp.schema'
import type { TemplateItem } from '../data/otp.type'
import { useOtpMutations } from '../hooks/use-otp-mutations'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Template being edited. Remount with `key`. */
  template: TemplateItem
}

export function OtpTemplateDialog({ open, onOpenChange, template }: Props) {
  const { t } = useTranslation('otp')
  const { saveTemplate } = useOtpMutations()
  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema(template.body)),
    defaultValues: { body: template.body, template_id: template.template_id ?? '', active: template.active },
  })
  const submit = form.handleSubmit((values) =>
    saveTemplate.mutate(
      { id: template.id, values: { ...values, active: template.required ? true : values.active } },
      { onSuccess: () => onOpenChange(false) }
    )
  )

  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      form={form}
      title={t('templates.form.title', { name: t(`templates.names.${template.identifier}`) })}
      description={t('templates.form.description', { variables: placeholders(template.body).join(', ') })}
      isCreate={false}
      isPending={saveTemplate.isPending}
      labels={{ saving: t('actions.saving'), saveAndExit: t('actions.save'), updating: t('actions.saving'), updateAndExit: t('actions.save') }}
      onSubmit={submit}
      contentClassName='sm:max-w-xl'
    >
      {!template.required && <FormSwitchField form={form} name='active' label={t('templates.form.active')} />}
      <FormTextareaField form={form} name='body' rows={5} label={t('templates.form.body')} hint={t('templates.form.bodyHint')} />
      <FormInputField form={form} name='template_id' label={t('templates.form.templateId')} hint={t('templates.form.templateIdHint')} />
    </EntityFormDialog>
  )
}
