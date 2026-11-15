import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormInputField } from '@/components/forms/form-input-field'
import { FormSelectField } from '@/components/forms/form-select-field'
import { ImagePicker } from '@/components/image-picker'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { type SettingsFormValues, settingsSchema } from '../data/refund.schema'
import type { RefundSettings } from '../data/refund.type'
import { useRefundMutations } from '../hooks/use-refund-mutations'

/** AEC business-settings of the addon: approval mode, refund type + period, dispute option + period, product sticker. */
export function RefundSettingsForm({ defaults }: { defaults: RefundSettings }) {
  const { t } = useTranslation('refund')
  const { saveSettings } = useRefundMutations()
  const form = useForm<SettingsFormValues>({ resolver: zodResolver(settingsSchema), defaultValues: defaults })
  const type = form.watch('refund_type')
  const dispute = form.watch('dispute_enabled')

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => saveSettings.mutate(v))} className='space-y-6 rounded-lg border bg-card p-6'>
        <div className='grid gap-4 md:grid-cols-2'>
          <FormSelectField
            form={form}
            name='approval_mode'
            label={t('settings.approvalMode')}
            options={[
              { value: 'admin_approval', label: t('settings.adminApproval') },
              { value: 'seller_direct', label: t('settings.sellerDirect') },
            ]}
          />
          <FormSelectField
            form={form}
            name='refund_type'
            label={t('settings.refundType')}
            options={[
              { value: 'global', label: t('settings.global') },
              { value: 'category', label: t('settings.category') },
            ]}
          />
        </div>
        {type !== defaults.refund_type && (
          <Alert variant='destructive'>
            <AlertDescription>{t('settings.typeWarning')}</AlertDescription>
          </Alert>
        )}
        {type === 'global' && (
          <FormInputField form={form} name='refund_days' type='number' label={t('settings.refundDays')} hint={t('settings.refundDaysHint')} />
        )}
        <FormField
          control={form.control}
          name='dispute_enabled'
          render={({ field }) => (
            <FormItem className='flex items-center justify-between rounded-md border p-3'>
              <div>
                <FormLabel>{t('settings.dispute')}</FormLabel>
                <FormDescription>{t('settings.disputeHint')}</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        {dispute && (
          <FormInputField form={form} name='dispute_days' type='number' label={t('settings.disputeDays')} hint={t('settings.disputeDaysHint')} />
        )}
        <FormField
          control={form.control}
          name='sticker'
          render={({ field }) => (
            <FormItem>
              <ImagePicker label={t('settings.sticker')} value={field.value} onChange={field.onChange} />
              <FormDescription>{t('settings.stickerHint')}</FormDescription>
            </FormItem>
          )}
        />
        <div className='flex justify-end border-t pt-6'>
          <Button type='submit' disabled={saveSettings.isPending}>
            {t(saveSettings.isPending ? 'actions.saving' : 'actions.save')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
