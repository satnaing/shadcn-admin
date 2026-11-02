import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
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
import { AttributeDialog } from './components/attribute-dialog'
import type { AttributeFormData, AttributeItem } from './data/attributes.type'
import { useAttributeMutations, useAttributes } from './hooks/useAttributes'

export function AttributesPage() {
  const { t } = useTranslation('catalog')
  const { data: attributesData, isLoading } = useAttributes()
  const attributes = attributesData?.data ?? []
  const { createAttribute, updateAttribute, deleteAttribute } = useAttributeMutations()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedAttr, setSelectedAttr] = useState<AttributeItem | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const handleOpenCreate = () => {
    setSelectedAttr(null)
    setDialogOpen(true)
  }

  const handleOpenEdit = (item: AttributeItem) => {
    setSelectedAttr(item)
    setDialogOpen(true)
  }

  const handleSubmit = async (formData: AttributeFormData) => {
    if (selectedAttr) {
      await updateAttribute({ id: selectedAttr.id, data: formData })
    } else {
      await createAttribute(formData)
    }
  }

  return (
    <AdminPageShell
      title={t('attributes.title')}
      description={t('attributes.description')}
      actions={
        <Button onClick={handleOpenCreate} className='gap-2'>
          <Plus className='h-4 w-4' />
          <span>{t('attributes.addNew')}</span>
        </Button>
      }
    >
      <div className='rounded-lg border bg-card shadow-xs'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('attributes.name')}</TableHead>
              <TableHead>{t('attributes.values')}</TableHead>
              <TableHead className='text-right'>{t('attributes.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className='h-32 text-center text-muted-foreground'>
                  Yüklənir...
                </TableCell>
              </TableRow>
            ) : attributes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className='h-32 text-center text-muted-foreground'>
                  Atribut tapılmadı.
                </TableCell>
              </TableRow>
            ) : (
              attributes.map((attr) => (
                <TableRow key={attr.id}>
                  <TableCell className='font-medium'>{attr.name}</TableCell>
                  <TableCell>
                    <div className='flex flex-wrap gap-1.5'>
                      {attr.values.map((val) => (
                        <Badge key={val} variant='secondary' className='text-xs'>
                          {val}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex items-center justify-end gap-1'>
                      <Button variant='ghost' size='icon' onClick={() => handleOpenEdit(attr)}>
                        <Pencil className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='text-destructive hover:text-destructive'
                        onClick={() => setDeleteId(attr.id)}
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

      <AttributeDialog
        key={dialogOpen ? (selectedAttr?.id ?? 'create') : 'closed'}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={selectedAttr}
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
            await deleteAttribute(deleteId)
            setDeleteId(null)
          }
        }}
      />
    </AdminPageShell>
  )
}

export default AttributesPage
