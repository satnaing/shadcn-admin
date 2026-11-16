import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { EntityFormDialog } from '@/components/forms/entity-form-dialog'
import { FormImageField } from '@/components/forms/form-image-field'
import { FormInputField } from '@/components/forms/form-input-field'
import { FormTextareaField } from '@/components/forms/form-textarea-field'
import {
  type NotificationFormValues,
  notificationSchema,
} from '../data/preorder.schema'
import type { NotificationTypeItem } from '../data/preorder.type'
import { usePreorderMutations } from '../hooks/use-preorder-mutations'
import { PreorderLocaleTabs } from './preorder-locale-tabs'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: NotificationTypeItem
}

/** Edit the icon and the per-language name/text of a notification type (`{placeholders}` are stripped like AEC does). */
export function PreorderNotificationDialog({
  open,
  onOpenChange,
  item,
}: Props) {
  const { t } = useTranslation('preorder')
  const { updateNotificationType } = usePreorderMutations()
  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: { image: item.image, translations: item.translations },
  })
  const submit = form.handleSubmit((values) =>
    updateNotificationType.mutate(
      { id: item.id, values },
      { onSuccess: () => onOpenChange(false) }
    )
  )

  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      form={form}
      title={t('notifications.form.title')}
      description={item.type}
      isCreate={false}
      isPending={updateNotificationType.isPending}
      labels={{
        saving: t('actions.saving'),
        saveAndExit: t('actions.save'),
        updating: t('actions.saving'),
        updateAndExit: t('actions.save'),
      }}
      onSubmit={submit}
      contentClassName='sm:max-w-xl'
    >
      <FormImageField
        form={form}
        name='image'
        label={t('notifications.form.image')}
      />
      <PreorderLocaleTabs>
        {(l) => (
          <>
            <FormInputField
              form={form}
              name={`translations.${l}.name`}
              label={t('notifications.form.name')}
            />
            <FormTextareaField
              form={form}
              name={`translations.${l}.default_text`}
              label={t('notifications.form.text')}
              rows={3}
            />
          </>
        )}
      </PreorderLocaleTabs>
    </EntityFormDialog>
  )
}
