import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import type { ProductListItem } from '../data/preorder.type'

/** Deposit and refund terms of a product as badges. */
export function PreorderProductTerms({
  product,
}: {
  product: ProductListItem
}) {
  const { t } = useTranslation('preorder')

  return (
    <div className='flex flex-wrap gap-1'>
      {product.is_prepayment && (
        <Badge variant='outline'>
          {t('products.prepayment')} {product.prepayment_amount}
          {product.prepayment_type === 'percent' ? '%' : ''}
        </Badge>
      )}
      {product.is_refundable && (
        <Badge variant='outline'>{t('products.refundable')}</Badge>
      )}
    </div>
  )
}
