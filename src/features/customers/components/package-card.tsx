import { Edit, Package, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { type CustomerPackageItem } from '../data/customers.type'

interface PackageCardProps {
  pkg: CustomerPackageItem
  onEdit: (pkg: CustomerPackageItem) => void
  onDelete: (id: number) => void
}

export function PackageCard({ pkg, onEdit, onDelete }: PackageCardProps) {
  const { t } = useTranslation('customers')

  return (
    <Card className='relative flex flex-col justify-between overflow-hidden border-2 text-center transition-all hover:border-primary/50 hover:shadow-md'>
      <CardHeader className='pb-2 pt-6'>
        <div className='mx-auto flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary'>
          {pkg.logo ? (
            <img src={pkg.logo} alt={pkg.name} className='size-12 rounded-full object-cover' />
          ) : (
            <Package className='size-10' />
          )}
        </div>
        <CardTitle className='mt-3 text-lg font-bold'>{pkg.name}</CardTitle>
        <div className='mt-1 text-2xl font-extrabold text-primary'>
          {pkg.amount === 0 ? t('free', 'Pulsuz') : `${pkg.amount.toFixed(2)} ₼`}
        </div>
      </CardHeader>

      <CardContent className='py-3 text-sm'>
        <div className='flex items-center justify-center gap-2 rounded-md bg-muted/50 p-2'>
          <span className='text-muted-foreground'>{t('packages.productUpload', 'Məhsul yükləmə limiti')}:</span>
          <span className='font-bold text-foreground'>{pkg.product_upload} ədəd</span>
        </div>
        <div className='mt-2'>
          {pkg.status ? (
            <Badge variant='success'>{t('active', 'Aktiv')}</Badge>
          ) : (
            <Badge variant='outline'>{t('inactive', 'Qeyri-aktiv')}</Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className='flex gap-2 pt-2'>
        <Button
          variant='outline'
          size='sm'
          className='flex-1 gap-1'
          onClick={() => onEdit(pkg)}
        >
          <Edit className='size-3.5' />
          {t('edit', 'Düzəliş et')}
        </Button>
        <Button
          variant='ghost'
          size='sm'
          className='text-destructive hover:bg-destructive/10'
          onClick={() => onDelete(pkg.id)}
        >
          <Trash2 className='size-4' />
        </Button>
      </CardFooter>
    </Card>
  )
}
