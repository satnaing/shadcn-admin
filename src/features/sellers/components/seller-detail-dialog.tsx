import { Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { type SellerItem } from '../data/sellers.type'

interface SellerDetailDialogProps {
  seller: SellerItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onToggleApproval?: (id: number, current: boolean) => void
  onToggleBan: (id: number, current: boolean) => void
}

export function SellerDetailDialog({
  seller,
  open,
  onOpenChange,
  onToggleApproval,
  onToggleBan,
}: SellerDetailDialogProps) {
  const { t } = useTranslation('sellers')

  if (!seller) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>{t('detail.title', 'Satıcı və Mağaza Profili')}</DialogTitle>
        </DialogHeader>

        <div className='space-y-4 py-2'>
          <div className='flex items-center gap-4 rounded-lg border p-4 bg-muted/30'>
            {seller.logo ? (
              <img src={seller.logo} alt={seller.name} className='size-14 rounded-full object-cover' />
            ) : (
              <div className='size-14 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary'>
                {seller.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className='font-bold text-lg leading-tight'>{seller.name}</h3>
              <p className='text-xs text-muted-foreground'>{seller.seller_name} • {seller.seller_email}</p>
              <div className='mt-1 flex items-center gap-1.5'>
                <Badge variant={seller.is_approved ? 'success' : 'outline'}>
                  {seller.is_approved ? t('status.approved', 'Təsdiqlənib') : t('status.pending', 'Gözləyir')}
                </Badge>
                {seller.is_verified && (
                  <Badge variant='outline' className='border-emerald-500 text-emerald-600'>
                    {t('status.verified', 'Doğrulanıb')}
                  </Badge>
                )}
                {seller.is_banned && (
                  <Badge variant='destructive'>{t('status.banned', 'Ban')}</Badge>
                )}
              </div>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-3 text-sm'>
            <div className='rounded border p-3'>
              <div className='text-xs text-muted-foreground'>{t('detail.balance', 'Cari Balans')}</div>
              <div className='text-lg font-bold text-emerald-600 dark:text-emerald-400'>
                {seller.balance.toFixed(2)} ₼
              </div>
            </div>
            <div className='rounded border p-3'>
              <div className='text-xs text-muted-foreground'>{t('detail.rating', 'Reytinq və İzləyici')}</div>
              <div className='flex items-center gap-1 font-semibold text-amber-500'>
                <Star className='size-4 fill-amber-500' />
                <span>{seller.rating.toFixed(1)}</span>
                <span className='text-xs text-muted-foreground'>({seller.followers_count} izləyici)</span>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-3 text-xs'>
            <div>
              <span className='text-muted-foreground'>{t('detail.phone', 'Telefon')}:</span>{' '}
              <span className='font-medium'>{seller.seller_phone}</span>
            </div>
            <div>
              <span className='text-muted-foreground'>{t('detail.products', 'Məhsul sayı')}:</span>{' '}
              <span className='font-medium'>{seller.products_count}</span>
            </div>
            <div>
              <span className='text-muted-foreground'>{t('detail.orders', 'Sifariş sayı')}:</span>{' '}
              <span className='font-medium'>{seller.orders_count}</span>
            </div>
            <div>
              <span className='text-muted-foreground'>{t('detail.registered', 'Qeydiyyat')}:</span>{' '}
              <span className='font-medium'>{seller.created_at}</span>
            </div>
          </div>
        </div>

        <DialogFooter className='gap-2 sm:justify-between'>
          <div className='flex gap-2'>
            {onToggleApproval && (
              <Button
                variant={seller.is_approved ? 'outline' : 'default'}
                size='sm'
                onClick={() => onToggleApproval(seller.id, seller.is_approved)}
              >
                {seller.is_approved ? t('actions.reject', 'Təsdiqi ləğv et') : t('actions.approve', 'Təsdiqlə')}
              </Button>
            )}
            <Button
              variant={seller.is_banned ? 'outline' : 'destructive'}
              size='sm'
              onClick={() => onToggleBan(seller.id, seller.is_banned)}
            >
              {seller.is_banned ? t('actions.unban', 'Bani qaldır') : t('actions.ban', 'Ban et')}
            </Button>
          </div>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            {t('dialog.close', 'Bağla')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
