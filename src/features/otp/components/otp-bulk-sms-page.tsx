import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { FormInputField } from '@/components/forms/form-input-field'
import { FormTextareaField } from '@/components/forms/form-textarea-field'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { type BulkSmsFormValues, bulkSmsDefaults, bulkSmsSchema } from '../data/otp.schema'
import { useOtpMutations } from '../hooks/use-otp-mutations'
import { OtpRecipientPicker } from './otp-recipient-picker'

/** Send one message to many customers (AEC "Send Bulk SMS"). */
export function OtpBulkSmsPage() {
  const { t } = useTranslation('otp')
  const { sendSms } = useOtpMutations()
  const form = useForm<BulkSmsFormValues>({ resolver: zodResolver(bulkSmsSchema), defaultValues: bulkSmsDefaults })
  const submit = form.handleSubmit((values) => sendSms.mutate(values, { onSuccess: () => form.reset(bulkSmsDefaults) }))

  return (
    <AdminPageShell title={t('bulk.title')} description={t('bulk.description')}>
      <Form {...form}>
        <form onSubmit={submit} className='max-w-2xl'>
          <Card>
            <CardContent className='space-y-4 pt-6'>
              <FormField
                control={form.control}
                name='phones'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('bulk.recipients')}</FormLabel>
                    <FormControl>
                      <OtpRecipientPicker value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormTextareaField form={form} name='content' rows={5} label={t('bulk.content')} />
              <FormInputField form={form} name='template_id' label={t('bulk.templateId')} hint={t('bulk.templateIdHint')} />
            </CardContent>
            <CardFooter className='justify-end'>
              <Button type='submit' disabled={sendSms.isPending}>
                {t(sendSms.isPending ? 'bulk.sending' : 'bulk.send')}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </AdminPageShell>
  )
}
