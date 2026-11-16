import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { EntityFormPage } from '@/components/forms/entity-form-page'
import {
  type ProductFormValues,
  productDefaults,
  productSchema,
} from '../data/preorder.schema'
import { usePreorderMutations } from '../hooks/use-preorder-mutations'
import { PreorderProductDelivery } from './preorder-product-delivery'
import { PreorderProductGeneral } from './preorder-product-general'
import { PreorderProductPayment } from './preorder-product-payment'
import { PreorderProductPricing } from './preorder-product-pricing'
import { PreorderProductSeo } from './preorder-product-seo'

/** `product` = loaded record when editing; `undefined` = create. Remount with `key`. */
export function PreorderProductForm({
  product,
}: {
  product?: ProductFormValues & { id: number }
}) {
  const { t } = useTranslation('preorder')
  const navigate = useNavigate()
  const { createProduct, updateProduct } = usePreorderMutations()
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product ?? productDefaults,
  })
  const mutation = product ? updateProduct : createProduct

  const submit = form.handleSubmit((values) => {
    const onSuccess = () => navigate({ to: '/admin/preorder/products' })
    if (product) updateProduct.mutate({ id: product.id, values }, { onSuccess })
    else createProduct.mutate(values, { onSuccess })
  })

  return (
    <EntityFormPage
      backTo='/admin/preorder/products'
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
        <PreorderProductGeneral form={form} />
        <PreorderProductPricing form={form} />
        <PreorderProductPayment form={form} />
        <PreorderProductDelivery form={form} />
        <PreorderProductSeo form={form} />
      </div>
    </EntityFormPage>
  )
}
