import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
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
import { ColorDialog } from './components/color-dialog'
import type { ColorFormData, ColorItem } from './data/colors.type'
import { useColorMutations, useColors } from './hooks/useColors'

const PRESET_COLORS: Record<string, string> = {
  '#000000': 'bg-black',
  '#FFFFFF': 'bg-white',
  '#FF0000': 'bg-red-600',
  '#0000FF': 'bg-blue-600',
  '#FFD700': 'bg-amber-400',
  '#C0C0C0': 'bg-slate-300',
  '#008000': 'bg-green-600',
}

export function ColorsPage() {
  const { t } = useTranslation('catalog')
  const { data: colorsData, isLoading } = useColors()
  const colors = colorsData?.data ?? []
  const { createColor, updateColor, deleteColor } = useColorMutations()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState<ColorItem | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const handleOpenCreate = () => {
    setSelectedColor(null)
    setDialogOpen(true)
  }

  const handleOpenEdit = (c: ColorItem) => {
    setSelectedColor(c)
    setDialogOpen(true)
  }

  const handleSubmit = async (formData: ColorFormData) => {
    if (selectedColor) {
      await updateColor({ id: selectedColor.id, data: formData })
    } else {
      await createColor(formData)
    }
  }

  return (
    <AdminPageShell
      title={t('colors.title')}
      description={t('colors.description')}
      actions={
        <Button onClick={handleOpenCreate} className='gap-2'>
          <Plus className='h-4 w-4' />
          <span>{t('colors.addNew')}</span>
        </Button>
      }
    >
      <div className='rounded-lg border bg-card shadow-xs'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-16'>{t('colors.preview')}</TableHead>
              <TableHead>{t('colors.name')}</TableHead>
              <TableHead>{t('colors.code')}</TableHead>
              <TableHead className='text-right'>{t('colors.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className='h-32 text-center text-muted-foreground'>
                  Yüklənir...
                </TableCell>
              </TableRow>
            ) : colors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className='h-32 text-center text-muted-foreground'>
                  Rəng tapılmadı.
                </TableCell>
              </TableRow>
            ) : (
              colors.map((c) => {
                const colorClass = PRESET_COLORS[c.code.toUpperCase()] ?? 'bg-primary'
                return (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div
                        className={`h-7 w-7 rounded-full border shadow-xs ${colorClass}`}
                      />
                    </TableCell>
                    <TableCell className='font-medium'>{c.name}</TableCell>
                    <TableCell className='font-mono text-xs text-muted-foreground'>
                      {c.code}
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex items-center justify-end gap-1'>
                        <Button variant='ghost' size='icon' onClick={() => handleOpenEdit(c)}>
                          <Pencil className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='text-destructive hover:text-destructive'
                          onClick={() => setDeleteId(c.id)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <ColorDialog
        key={dialogOpen ? (selectedColor?.id ?? 'create') : 'closed'}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={selectedColor}
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
            await deleteColor(deleteId)
            setDeleteId(null)
          }
        }}
      />
    </AdminPageShell>
  )
}

export default ColorsPage
