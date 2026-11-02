import { Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { type SellerPackageItem } from '../data/sellers.type'

interface SellerPackageCardProps {
  pkg: SellerPackageItem
  onEdit: (pkg: SellerPackageItem) => void
  onDelete: (id: number) => void
}

export function SellerPackageCard({ pkg, onEdit, onDelete }: SellerPackageCardProps) {
  const { t } = useTranslation('sellers')

  return (
    <Card className='flex flex-col justify-between'>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg'>{pkg.name}</CardTitle>
          <Badge variant={pkg.status ? 'success' : 'outline'}>
            {pkg.status ? t('status.active', 'Aktiv') : t('status.inactive', 'Qeyri-aktiv')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className='space-y-3 pb-4'>
        <div className='text-3xl font-extrabold'>
          {pkg.amount === 0 ? (
            <span className='text-emerald-600 dark:text-emerald-400'>Pulsuz</span>
          ) : (
            `${pkg.amount.toFixed(2)} ₼`
          )}
          <span className='text-xs font-normal text-muted-foreground'> / {pkg.duration_days} gün</span>
        </div>

        <div className='space-y-1.5 text-xs'>
          <div className='flex justify-between border-b pb-1'>
            <span className='text-muted-foreground'>{t('packages.uploadLimit', 'Məhsul yükləmə limiti')}</span>
            <span className='font-semibold'>{pkg.product_upload_limit} ədəd</span>
          </div>
          <div className='flex justify-between border-b pb-1'>
            <span className='text-muted-foreground'>{t('packages.duration', 'Müddət')}</span>
            <span className='font-semibold'>{pkg.duration_days} gün</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className='flex justify-end gap-2 border-t pt-3'>
        <Button variant='outline' size='sm' onClick={() => onEdit(pkg)} className='gap-1'>
          <Pencil className='size-3.5' />
          {t('dialog.edit', 'Redaktə et')}
        </Button>
        <Button
          variant='ghost'
          size='sm'
          className='text-destructive hover:bg-destructive/10'
          onClick={() => onDelete(pkg.id)}
        >
          <Trash2 className='size-3.5' />
        </Button>
      </CardFooter>
    </Card>
  )
}
