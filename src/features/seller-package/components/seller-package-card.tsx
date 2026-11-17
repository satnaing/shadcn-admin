import { useCurrencyFormatter } from '@/shared/hooks/useCurrencyFormatter'
import { PERMISSIONS } from '@/shared/permissions'
import { Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PermissionGuard } from '@/components/guard'
import { useModuleEnabled } from '@/hooks/use-module-enabled'
import type { SellerPackage } from '../data/seller-package.type'

interface Props {
  pack: SellerPackage
  onEdit: (pack: SellerPackage) => void
  onDelete: (pack: SellerPackage) => void
}

export function SellerPackageCard({ pack, onEdit, onDelete }: Props) {
  const { t } = useTranslation('seller_package')
  const { formatMoney } = useCurrencyFormatter()
  const preorder = useModuleEnabled('preorder')

  return (
    <Card>
      <CardContent className='flex flex-col items-center gap-3 pt-6 text-center'>
        <img
          src={pack.logo}
          alt={pack.name}
          className='size-24 rounded-full border object-cover'
          loading='lazy'
        />
        <h3 className='text-base font-semibold'>{pack.name}</h3>
        <p className='text-2xl font-bold'>
          {pack.amount === 0 ? t('card.free') : formatMoney(pack.amount)}
        </p>
        <ul className='space-y-1 text-sm text-muted-foreground'>
          <li>{t('card.uploads', { count: pack.product_upload_limit })}</li>
          {preorder && (
            <li>
              {t('card.preorderUploads', {
                count: pack.preorder_product_upload_limit,
              })}
            </li>
          )}
          <li>{t('card.days', { count: pack.duration })}</li>
          <li>{t('card.sellers', { count: pack.sellers_count })}</li>
        </ul>
        <div className='flex w-full gap-2'>
          <PermissionGuard permission={PERMISSIONS.SELLER_PACKAGE.EDIT}>
            <Button
              variant='outline'
              className='flex-1'
              onClick={() => onEdit(pack)}
            >
              <Pencil className='me-2 size-4' />
              {t('actions.edit')}
            </Button>
          </PermissionGuard>
          <PermissionGuard permission={PERMISSIONS.SELLER_PACKAGE.DELETE}>
            <Button
              variant='outline'
              size='icon'
              aria-label={t('actions.delete')}
              onClick={() => onDelete(pack)}
            >
              <Trash2 className='size-4' />
            </Button>
          </PermissionGuard>
        </div>
      </CardContent>
    </Card>
  )
}
