import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { EntityFormDialog } from '@/components/forms/entity-form-dialog'
import { FormInputField } from '@/components/forms/form-input-field'
import { FormTextareaField } from '@/components/forms/form-textarea-field'
import {
  type AddressFormValues,
  addressDefaults,
  addressSchema,
} from '../data/pos.schema'
import { usePosMutations } from '../hooks/use-pos-mutations'
import { PosRegionFields } from './pos-region-fields'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  customerId: number
  onCreated: (addressId: number) => void
}

/** New shipping address for the selected customer (AEC `new-address-modal`). Mount it only while open so the form resets. */
export function PosAddressDialog({
  open,
  onOpenChange,
  customerId,
  onCreated,
}: Props) {
  const { t } = useTranslation('pos')
  const { createAddress } = usePosMutations()
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: addressDefaults,
  })
  const submit = form.handleSubmit((values) =>
    createAddress.mutate(
      { customerId, values },
      {
        onSuccess: (res) => {
          onCreated((res as { data: { id: number } }).data.id)
          onOpenChange(false)
        },
      }
    )
  )

  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      form={form}
      title={t('address.title')}
      description={t('address.description')}
      isCreate
      isPending={createAddress.isPending}
      labels={{
        saving: t('actions.saving'),
        saveAndExit: t('actions.save'),
        updating: t('actions.saving'),
        updateAndExit: t('actions.save'),
      }}
      onSubmit={submit}
      contentClassName='sm:max-w-xl'
    >
      <div className='grid gap-4 sm:grid-cols-2'>
        <PosRegionFields form={form} />
        <FormInputField
          form={form}
          name='postal_code'
          label={t('address.postalCode')}
        />
        <FormInputField form={form} name='phone' label={t('address.phone')} />
      </div>
      <FormTextareaField
        form={form}
        name='address'
        label={t('address.address')}
        rows={3}
      />
    </EntityFormDialog>
  )
}
