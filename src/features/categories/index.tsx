import { useState } from 'react'
import { FolderTree, Pencil, Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { CategoryDialog } from './components/category-dialog'
import type { CategoryFormData, CategoryItem } from './data/categories.type'
import { useCategories, useCategoryMutations } from './hooks/useCategories'

export function CategoriesPage() {
  const { t } = useTranslation('catalog')
  const { data: categoriesData, isLoading } = useCategories()
  const categories = categoriesData?.data ?? []
  const { createCategory, updateCategory, deleteCategory } = useCategoryMutations()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const handleOpenEdit = (cat: CategoryItem) => {
    setSelectedCategory(cat)
    setDialogOpen(true)
  }

  const handleSubmit = async (formData: CategoryFormData) => {
    if (selectedCategory) {
      await updateCategory({ id: selectedCategory.id, data: formData })
    } else {
      await createCategory(formData)
    }
  }

  const handleToggle = (cat: CategoryItem, field: 'featured' | 'hot_category', value: boolean) => {
    updateCategory({ id: cat.id, data: { [field]: value } })
  }

  return (
    <AdminPageShell
      title={t('categories.title')}
      description={t('categories.description')}
      actions={
        <Button onClick={() => { setSelectedCategory(null); setDialogOpen(true) }} className='gap-2'>
          <Plus className='h-4 w-4' />
          <span>{t('categories.addNew')}</span>
        </Button>
      }
    >
      <div className='rounded-lg border bg-card shadow-xs'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-12'>{t('categories.icon')}</TableHead>
              <TableHead>{t('categories.name')}</TableHead>
              <TableHead>{t('categories.parent')}</TableHead>
              <TableHead className='text-center'>{t('categories.orderLevel')}</TableHead>
              <TableHead className='text-center'>{t('categories.level')}</TableHead>
              <TableHead className='text-center'>{t('categories.featured')}</TableHead>
              <TableHead className='text-center'>{t('categories.hot')}</TableHead>
              <TableHead className='text-center'>{t('categories.commission')}</TableHead>
              <TableHead className='text-right'>{t('categories.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={9} className='h-32 text-center text-muted-foreground'>Yüklənir...</TableCell></TableRow>
            ) : categories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>
                  <div className='flex h-8 w-8 items-center justify-center rounded border bg-muted text-muted-foreground'>
                    <FolderTree className='h-4 w-4' />
                  </div>
                </TableCell>
                <TableCell className='font-medium'>
                  <div className={cat.level === 1 ? 'pl-4' : cat.level >= 2 ? 'pl-8' : ''}>
                    {cat.level > 0 && <span className='mr-1.5 text-muted-foreground'>—</span>}
                    {cat.name}
                  </div>
                </TableCell>
                <TableCell className='text-xs text-muted-foreground'>{cat.parent_name ?? t('categories.noParent')}</TableCell>
                <TableCell className='text-center text-xs'>{cat.order_level}</TableCell>
                <TableCell className='text-center text-xs'>Level {cat.level}</TableCell>
                <TableCell className='text-center'>
                  <Switch checked={Boolean(cat.featured)} onCheckedChange={(val) => handleToggle(cat, 'featured', val)} />
                </TableCell>
                <TableCell className='text-center'>
                  <Switch checked={Boolean(cat.hot_category)} onCheckedChange={(val) => handleToggle(cat, 'hot_category', val)} />
                </TableCell>
                <TableCell className='text-center text-xs font-semibold'>{cat.commision_rate}%</TableCell>
                <TableCell className='text-right'>
                  <div className='flex items-center justify-end gap-1'>
                    <Button variant='ghost' size='icon' onClick={() => handleOpenEdit(cat)}><Pencil className='h-4 w-4' /></Button>
                    <Button variant='ghost' size='icon' className='text-destructive' onClick={() => setDeleteId(cat.id)}><Trash2 className='h-4 w-4' /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CategoryDialog
        key={dialogOpen ? (selectedCategory?.id ?? 'create') : 'closed'}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={selectedCategory}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title={t('deleteConfirm.title')}
        desc={t('deleteConfirm.description')}
        confirmText={t('deleteConfirm.confirm')}
        cancelBtnText={t('deleteConfirm.cancel')}
        handleConfirm={async () => {
          if (deleteId) {
            await deleteCategory(deleteId)
            setDeleteId(null)
          }
        }}
      />
    </AdminPageShell>
  )
}

export default CategoriesPage
