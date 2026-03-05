import { useState } from 'react'
import { type Ingredient } from '@/types/inventory'
import { FileSpreadsheet, Plus } from 'lucide-react'
import { useIngredients } from '@/hooks/queries/use-inventory'
import { BrandLoader } from '@/components/ui/brand-loader'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/custom/data-table'
import { PageTitle } from '@/components/page-title'
import { IngredientImportDialog } from './_components/ingredient-import-dialog'
import { IngredientSheet } from './_components/ingredient-sheet'
import { columns } from './_components/ingredients-columns'

export default function IngredientsPage() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const { data: response, isLoading } = useIngredients({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  })
  const ingredients = response?.data || []
  const [open, setOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient | null>(null)

  const handleEdit = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient)
    setOpen(true)
  }

  const handleCreate = () => {
    setSelectedIngredient(null)
    setOpen(true)
  }

  if (isLoading) {
    return (
      <div className='flex h-full items-center justify-center p-6'>
        <BrandLoader />
      </div>
    )
  }

  return (
    <div className='p-6'>
      <PageTitle
        title='Ingredients'
        subtitle='Manage your ingredients inventory.'
        actions={
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setImportOpen(true)}
            >
              <FileSpreadsheet className='mr-2 h-4 w-4' />
              Import
            </Button>
            <Button onClick={handleCreate} size='sm'>
              <Plus className='mr-2 h-4 w-4' />
              Add Ingredient
            </Button>
          </div>
        }
      />

      <DataTable
        columns={columns(handleEdit)}
        data={ingredients}
        searchKey='name'
        searchPlaceholder='Filter ingredients...'
        pageCount={response?.meta?.totalPages}
        pagination={pagination}
        onPaginationChange={setPagination}
      />

      <IngredientSheet
        open={open}
        onOpenChange={(val) => {
          setOpen(val)
          if (!val) setSelectedIngredient(null)
        }}
        initialData={selectedIngredient}
      />

      <IngredientImportDialog open={importOpen} onOpenChange={setImportOpen} />
    </div>
  )
}
