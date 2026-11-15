import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { EntityFormDialog } from '@/components/forms/entity-form-dialog'
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { type ClaimFormValues, claimSchema } from '../data/qrcode-event.schema'
import { useQrMutations } from '../hooks/use-qrcode-event-mutations'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  codeId: number
}

/** Marks a revealed winning code as handed over ("hansı uduşların verildiyi"). */
export function QrClaimDialog({ open, onOpenChange, codeId }: Props) {
  const { t } = useTranslation('qrcode_event')
  const { claimCode } = useQrMutations()
  const form = useForm<ClaimFormValues>({ resolver: zodResolver(claimSchema), defaultValues: { claim_note: '' } })

  const submit = form.handleSubmit((values) =>
    claimCode.mutate({ id: codeId, note: values.claim_note }, { onSuccess: () => onOpenChange(false) })
  )

  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      form={form}
      title={t('codes.claim.title')}
      description={t('codes.claim.description')}
      isCreate
      isPending={claimCode.isPending}
      labels={{ saving: t('actions.saving'), saveAndExit: t('codes.claim.confirm'), updating: '', updateAndExit: '' }}
      onSubmit={submit}
      contentClassName='sm:max-w-md'
    >
      <FormField
        control={form.control}
        name='claim_note'
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('codes.claim.note')}</FormLabel>
            <FormControl>
              <Textarea rows={3} {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </EntityFormDialog>
  )
}
