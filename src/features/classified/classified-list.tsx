import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { ClassifiedDialog } from './components/classified-dialog'
import { ClassifiedFilterBar } from './components/classified-filter-bar'
import { ClassifiedTable } from './components/classified-table'
import {
  type ClassifiedCondition,
  type ClassifiedCreatorType,
  type ClassifiedProductItem,
} from './data/classified.type'
import { useClassifiedMutations, useClassifiedProducts } from './hooks/useClassified'

interface ClassifiedListProps {
  initialType?: 'all' | 'in-house' | 'seller'
}

export function ClassifiedList({ initialType = 'all' }: ClassifiedListProps) {
  const { t } = useTranslation('classified')
  const defaultCreator = initialType === 'in-house' ? 'admin' : initialType === 'seller' ? 'seller' : 'all'
  const [search, setSearch] = useState('')
  const [creatorType, setCreatorType] = useState<'all' | ClassifiedCreatorType>(defaultCreator)
  const [condition, setCondition] = useState<'all' | ClassifiedCondition>('all')
  const [dialogOpen, setDialogOpen] = useState(false)

  const { data, isLoading } = useClassifiedProducts({
    search,
    creator_type: creatorType,
    condition,
  })
  const { toggleStatusMutation, createMutation, deleteMutation } = useClassifiedMutations()

  const products = Array.isArray(data?.data) ? data.data : []

  const handleSave = (payload: Partial<ClassifiedProductItem>) => {
    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.success(t('messages.created', 'Elan uğurla əlavə edildi!'))
      },
    })
  }

  const handleDelete = (id: number) => {
    if (window.confirm(t('messages.confirmDelete', 'Bu elanı silmək istədiyinizə əminsiniz?'))) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          toast.success(t('messages.deleted', 'Elan silindi!'))
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
              {initialType === 'in-house'
                ? t('titles.inHouse', 'Daxili Elan Məhsulları')
                : initialType === 'seller'
                  ? t('titles.seller', 'Satıcı Elan Məhsulları')
                  : t('titles.all', 'Bütün Elan Məhsulları')}
            </h1>
            <p className='text-sm text-muted-foreground'>
              {t('titles.subtitle', 'Yalnız admin və satıcılar tərəfindən idarə olunan elanlar')}
            </p>
          </div>

          <Button onClick={() => setDialogOpen(true)} className='gap-2'>
            <Plus className='size-4' />
            {t('actions.addNew', 'Yeni Elan Əlavə Et')}
          </Button>
        </div>

        <div className='flex flex-col gap-4 rounded-lg border bg-card p-4'>
          <ClassifiedFilterBar
            search={search}
            onSearchChange={setSearch}
            creatorType={creatorType}
            onCreatorTypeChange={setCreatorType}
            condition={condition}
            onConditionChange={setCondition}
            hideCreatorFilter={initialType !== 'all'}
          />

          <ClassifiedTable
            products={products}
            isLoading={isLoading}
            onToggleStatus={(id, st) => toggleStatusMutation.mutate({ id, is_published: st })}
            onDelete={handleDelete}
          />
        </div>

        <ClassifiedDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          defaultCreatorType={initialType === 'seller' ? 'seller' : 'admin'}
          onSave={handleSave}
        />
      </Main>
    </>
  )
}

export default ClassifiedList
