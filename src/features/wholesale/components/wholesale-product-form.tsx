import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { EntityFormPage } from '@/components/forms/entity-form-page'
import {
  type ProductFormValues,
  productDefaults,
  productSchema,
} from '../data/wholesale.schema'
import { useWholesaleMutations } from '../hooks/use-wholesale-mutations'
import { WholesaleFormCategories } from './wholesale-form-categories'
import { WholesaleFormGeneral } from './wholesale-form-general'
import { WholesaleFormOptions } from './wholesale-form-options'
import { WholesaleFormPricing } from './wholesale-form-pricing'
import { WholesaleFormTiers } from './wholesale-form-tiers'

/** `product` = loaded record when editing; `undefined` = create. Remount with `key`. */
export function WholesaleProductForm({
  product,
}: {
  product?: ProductFormValues & { id: number }
}) {
  const { t } = useTranslation('wholesale')
  const navigate = useNavigate()
  const { createProduct, updateProduct } = useWholesaleMutations()
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product ?? productDefaults,
  })
  const mutation = product ? updateProduct : createProduct

  const submit = form.handleSubmit((values) => {
    const onSuccess = () => navigate({ to: '/admin/wholesale' })
    if (product) updateProduct.mutate({ id: product.id, values }, { onSuccess })
    else createProduct.mutate(values, { onSuccess })
  })

  return (
    <EntityFormPage
      backTo='/admin/wholesale'
      form={form}
      title={t(product ? 'form.editTitle' : 'form.createTitle')}
      description={t('form.pageDescription')}
      isCreate={!product}
      isPending={mutation.isPending}
      labels={{
        saving: t('actions.saving'),
        saveAndExit: t('actions.save'),
        updating: t('actions.saving'),
        updateAndExit: t('actions.save'),
      }}
      onSubmit={submit}
    >
      <div className='space-y-6'>
        <WholesaleFormGeneral form={form} />
        <WholesaleFormPricing form={form} />
        <WholesaleFormTiers form={form} />
        <WholesaleFormCategories form={form} />
        <WholesaleFormOptions form={form} />
      </div>
    </EntityFormPage>
  )
}
