import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { CategoryDiscountDialog } from './components/category-discount-dialog'
import { CategoryDiscountsTable } from './components/category-discounts-table'
import { type CategoryDiscountItem } from './data/promotions.type'
import { useCategoryDiscounts, usePromotionMutations } from './hooks/usePromotions'

export function CategoryDiscounts() {
  const { t } = useTranslation('promotions')
  const [dialogOpen, setDialogOpen] = useState(false)

  const { data, isLoading } = useCategoryDiscounts()
  const { saveCategoryDiscountMutation, deleteCategoryDiscountMutation } = usePromotionMutations()

  const discounts = data?.data ?? []

  const handleSave = (payload: Partial<CategoryDiscountItem>) => {
    saveCategoryDiscountMutation.mutate(payload, {
      onSuccess: () => {
        toast.success(t('messages.categoryDiscountSaved', 'Kateqoriya endirimi tətbiq edildi!'))
      },
    })
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Bu kateqoriya endirimini ləğv etmək istədiyinizə əminsiniz?')) {
      deleteCategoryDiscountMutation.mutate(id, {
        onSuccess: () => {
          toast.success(t('messages.categoryDiscountDeleted', 'Endirim silindi!'))
        },
      })
    }
  }

  return (
    <>
      <AdminHeader />
      <Main fluid className='space-y-4'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              {t('titles.categoryDiscounts', 'Kateqoriya üzrə Endirimlər')}
            </h1>
            <p className='text-sm text-muted-foreground'>
              {t('titles.categoryDiscountsSubtitle', 'Seçilmiş kateqoriyadakı bütün məhsullara toplu endirim tətbiqi')}
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className='gap-2'>
            <Plus className='size-4' />
            {t('categories.addNew', 'Yeni Kateqoriya Endirimi')}
          </Button>
        </div>

        <div className='flex flex-col gap-4 rounded-lg border bg-card p-4'>
          <CategoryDiscountsTable
            discounts={discounts}
            isLoading={isLoading}
            onDelete={handleDelete}
          />
        </div>

        <CategoryDiscountDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSave={handleSave}
        />
      </Main>
    </>
  )
}

export default CategoryDiscounts
