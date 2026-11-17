import { useCurrencyFormatter } from '@/shared/hooks/useCurrencyFormatter'
import { PERMISSIONS } from '@/shared/permissions'
import { Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PermissionGuard } from '@/components/guard'
import type { ClassifiedPackage } from '../data/classified.type'

interface Props {
  pack: ClassifiedPackage
  onEdit: (pack: ClassifiedPackage) => void
  onDelete: (pack: ClassifiedPackage) => void
}

export function ClassifiedPackageCard({ pack, onEdit, onDelete }: Props) {
  const { t } = useTranslation('classified')
  const { formatMoney } = useCurrencyFormatter()

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
          {pack.amount === 0 ? t('packages.free') : formatMoney(pack.amount)}
        </p>
        <p className='text-sm text-muted-foreground'>
          {t('packages.uploads', { count: pack.product_upload })}
        </p>
        <PermissionGuard permission={PERMISSIONS.CLASSIFIED.PACKAGES_MANAGE}>
          <div className='flex w-full gap-2'>
            <Button
              variant='outline'
              className='flex-1'
              onClick={() => onEdit(pack)}
            >
              <Pencil className='me-2 size-4' />
              {t('actions.edit')}
            </Button>
            <Button
              variant='outline'
              size='icon'
              aria-label={t('actions.delete')}
              onClick={() => onDelete(pack)}
            >
              <Trash2 className='size-4' />
            </Button>
          </div>
        </PermissionGuard>
      </CardContent>
    </Card>
  )
}
