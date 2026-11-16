import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { FormInputField } from '@/components/forms/form-input-field'
import {
  type ProductPointFormValues,
  productPointSchema,
} from '../data/club-point.schema'
import type { ProductPointItem } from '../data/club-point.type'
import { useClubPointMutations } from '../hooks/use-club-point-mutations'

function PointForm({
  product,
  onClose,
}: {
  product: ProductPointItem
  onClose: () => void
}) {
  const { t } = useTranslation('club_point')
  const { saveProduct } = useClubPointMutations()
  const form = useForm<ProductPointFormValues>({
    resolver: zodResolver(productPointSchema),
    defaultValues: { point: product.earn_point },
  })

  return (
    <Form {...form}>
      <form
        className='space-y-4'
        onSubmit={form.handleSubmit((v) =>
          saveProduct.mutate(
            { id: product.id, point: v.point },
            { onSuccess: onClose }
          )
        )}
      >
        <FormInputField
          form={form}
          name='point'
          type='number'
          label={t('product.point')}
          hint={t('product.pointHint')}
        />
        <DialogFooter>
          <Button type='submit' disabled={saveProduct.isPending}>
            {t(saveProduct.isPending ? 'actions.saving' : 'actions.save')}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

/** Points one unit of a single product earns. */
export function ClubPointProductDialog({
  product,
  onClose,
}: {
  product: ProductPointItem | null
  onClose: () => void
}) {
  const { t } = useTranslation('club_point')

  return (
    <Dialog open={!!product} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='text-start'>
          <DialogTitle>{t('product.title')}</DialogTitle>
          <DialogDescription>{product?.name}</DialogDescription>
        </DialogHeader>
        {product && <PointForm product={product} onClose={onClose} />}
      </DialogContent>
    </Dialog>
  )
}
