import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { EntityFormDialog } from '@/components/forms/entity-form-dialog'
import { FormSelectField } from '@/components/forms/form-select-field'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { OTHERS, type RejectFormValues, rejectReasonText, rejectSchema } from '../data/refund.schema'
import type { RefundDetail, RefundKind } from '../data/refund.type'
import { useRejectionReasons } from '../hooks/use-refund'
import { useRefundMutations } from '../hooks/use-refund-mutations'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  refund: RefundDetail
  kind: RefundKind
  onDone: () => void
}

/** Pick one of the preset rejection reasons or write a custom one; the API stores the final text. */
export function RefundRejectDialog({ open, onOpenChange, refund, kind, onDone }: Props) {
  const { t, i18n } = useTranslation('refund')
  const { data } = useRejectionReasons()
  const { reject, rejectDispute } = useRefundMutations()
  const mutation = kind === 'dispute' ? rejectDispute : reject
  const form = useForm<RejectFormValues>({ resolver: zodResolver(rejectSchema), defaultValues: { preset: '', custom: '' } })
  const lang = (['az', 'en', 'tr', 'ru'].includes(i18n.language) ? i18n.language : 'en') as 'az' | 'en' | 'tr' | 'ru'
  const options = [
    ...(data?.data ?? []).map((r) => {
      const text = r.translations[lang] || r.reason
      return { value: text, label: text }
    }),
    { value: OTHERS, label: t('reject.others') },
  ]

  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      form={form}
      title={t('reject.title')}
      description={t('reject.description', { code: refund.code })}
      isCreate
      isPending={mutation.isPending}
      labels={{ saving: t('actions.saving'), saveAndExit: t('actions.confirm'), updating: t('actions.saving'), updateAndExit: t('actions.confirm') }}
      onSubmit={form.handleSubmit((v) =>
        mutation.mutate(
          { id: refund.id, reason: rejectReasonText(v) },
          { onSuccess: () => { onOpenChange(false); onDone() } }
        )
      )}
      contentClassName='sm:max-w-md'
    >
      <FormSelectField form={form} name='preset' label={t('reject.reason')} options={options} placeholder={t('reject.select')} />
      {form.watch('preset') === OTHERS && (
        <FormField
          control={form.control}
          name='custom'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('reject.custom')}</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} placeholder={t('reject.customPlaceholder')} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </EntityFormDialog>
  )
}
