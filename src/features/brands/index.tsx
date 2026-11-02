import { useState } from 'react'
import { Pencil, Plus, Tag, Trash2 } from 'lucide-react'
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
import { BrandDialog } from './components/brand-dialog'
import type { BrandFormData, BrandItem } from './data/brands.type'
import { useBrandMutations, useBrands } from './hooks/useBrands'

export function BrandsPage() {
  const { t } = useTranslation('catalog')
  const { data: brandsData, isLoading } = useBrands()
  const brands = brandsData?.data ?? []
  const { createBrand, updateBrand, deleteBrand } = useBrandMutations()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<BrandItem | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const handleOpenCreate = () => {
    setSelectedBrand(null)
    setDialogOpen(true)
  }

  const handleOpenEdit = (brand: BrandItem) => {
    setSelectedBrand(brand)
    setDialogOpen(true)
  }

  const handleSubmit = async (formData: BrandFormData) => {
    if (selectedBrand) {
      await updateBrand({ id: selectedBrand.id, data: formData })
    } else {
      await createBrand(formData)
    }
  }

  const handleToggle = async (brand: BrandItem, value: boolean) => {
    await updateBrand({ id: brand.id, data: { top: value } })
  }

  return (
    <AdminPageShell
      title={t('brands.title')}
      description={t('brands.description')}
      actions={
        <Button onClick={handleOpenCreate} className='gap-2'>
          <Plus className='h-4 w-4' />
          <span>{t('brands.addNew')}</span>
        </Button>
      }
    >
      <div className='rounded-lg border bg-card shadow-xs'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-12'>{t('brands.logo')}</TableHead>
              <TableHead>{t('brands.name')}</TableHead>
              <TableHead className='text-center'>{t('brands.top')}</TableHead>
              <TableHead className='text-right'>{t('brands.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className='h-32 text-center text-muted-foreground'>
                  Yüklənir...
                </TableCell>
              </TableRow>
            ) : brands.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className='h-32 text-center text-muted-foreground'>
                  Brend tapılmadı.
                </TableCell>
              </TableRow>
            ) : (
              brands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell>
                    <div className='flex h-8 w-8 items-center justify-center rounded border bg-muted text-muted-foreground'>
                      <Tag className='h-4 w-4' />
                    </div>
                  </TableCell>
                  <TableCell className='font-medium'>{brand.name}</TableCell>
                  <TableCell className='text-center'>
                    <Switch
                      checked={Boolean(brand.top)}
                      onCheckedChange={(val) => handleToggle(brand, val)}
                    />
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex items-center justify-end gap-1'>
                      <Button variant='ghost' size='icon' onClick={() => handleOpenEdit(brand)}>
                        <Pencil className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='text-destructive hover:text-destructive'
                        onClick={() => setDeleteId(brand.id)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <BrandDialog
        key={dialogOpen ? (selectedBrand?.id ?? 'create') : 'closed'}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={selectedBrand}
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
            await deleteBrand(deleteId)
            setDeleteId(null)
          }
        }}
      />
    </AdminPageShell>
  )
}

export default BrandsPage
