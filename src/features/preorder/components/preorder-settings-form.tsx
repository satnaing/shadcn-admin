import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { FormImageField } from '@/components/forms/form-image-field'
import { FormInputField } from '@/components/forms/form-input-field'
import { FormSwitchField } from '@/components/forms/form-switch-field'
import { FormTextareaField } from '@/components/forms/form-textarea-field'
import {
  type SettingsFormValues,
  settingsSchema,
} from '../data/preorder.schema'
import { usePreorderMutations } from '../hooks/use-preorder-mutations'
import { PreorderFormSection } from './preorder-form-section'

/** AEC business-settings of the addon: seller preorders + commission, flat shipping, instructions, payment QR, FAQ banner. */
export function PreorderSettingsForm({
  defaults,
}: {
  defaults: SettingsFormValues
}) {
  const { t } = useTranslation('preorder')
  const { saveSettings } = usePreorderMutations()
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: defaults,
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((v) => saveSettings.mutate(v))}
        className='space-y-6'
      >
        <PreorderFormSection title={t('settings.sellers')}>
          <FormSwitchField
            form={form}
            name='allow_seller_products'
            label={t('settings.allowSellers')}
            hint={t('settings.allowSellersHint')}
          />
          <FormInputField
            form={form}
            name='seller_commission'
            type='number'
            label={t('settings.commission')}
            hint={t('settings.commissionHint')}
          />
        </PreorderFormSection>
        <PreorderFormSection title={t('settings.general')}>
          <FormInputField
            form={form}
            name='flat_shipping_rate'
            type='number'
            label={t('settings.flatShipping')}
            hint={t('settings.flatShippingHint')}
          />
          <FormImageField
            form={form}
            name='faq_banner'
            label={t('settings.faqBanner')}
          />
        </PreorderFormSection>
        <PreorderFormSection title={t('settings.instructions')}>
          <FormTextareaField
            form={form}
            name='request_instruction'
            label={t('settings.requestInstruction')}
            rows={4}
          />
          <FormTextareaField
            form={form}
            name='prepayment_instruction'
            label={t('settings.prepaymentInstruction')}
            rows={4}
          />
          <FormImageField
            form={form}
            name='payment_qr'
            label={t('settings.paymentQr')}
          />
        </PreorderFormSection>
        <div className='flex justify-end'>
          <Button type='submit' disabled={saveSettings.isPending}>
            {t(saveSettings.isPending ? 'actions.saving' : 'actions.save')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
