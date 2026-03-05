import { useState } from 'react'
import { useCategories } from '@/hooks/queries/use-catalog'
import { BrandLoader } from '@/components/ui/brand-loader'
import { PageTitle } from '@/components/page-title'
import { type Category } from '../data/schema'
import { CategoriesTable } from './_components/categories-table'
import { CategorySheet } from './_components/category-sheet'

export default function CategoriesPage() {
  const [open, setOpen] = useState(false)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [selectedCategory, setSelectedCategory] = useState<
    | (React.ComponentProps<typeof CategorySheet>['initialData'] & {
        id?: string
      })
    | null
  >(null)

  const { data: response, isLoading } = useCategories({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  })

  const categories = response?.data || []

  const handleEdit = (category: Category) => {
    // @ts-expect-error - Mismatch between schema Category and CategorySheet props (imageUrl type)
    setSelectedCategory(category)
    setOpen(true)
  }

  if (isLoading) {
    return (
      <div className='flex h-[80vh] w-full items-center justify-center'>
        <BrandLoader />
      </div>
    )
  }

  return (
    <div className='p-6'>
      <PageTitle
        title='Categories'
        subtitle='Manage your menu categories and structure.'
        onClick={() => {
          setSelectedCategory(null)
          setOpen(true)
        }}
      />

      <CategoriesTable
        data={categories}
        onEdit={handleEdit}
        pageCount={response?.meta?.totalPages}
        pagination={pagination}
        onPaginationChange={setPagination}
      />

      <CategorySheet
        open={open}
        onOpenChange={setOpen}
        initialData={
          selectedCategory
            ? {
                id: selectedCategory?.id || undefined,
                name: selectedCategory?.name || {},
                slug: selectedCategory?.slug || '',
                sortOrder: selectedCategory?.sortOrder || 0,
                description: selectedCategory?.description || undefined,
                parentId: selectedCategory?.parentId || undefined,
                imageUrl: selectedCategory?.imageUrl || {},
              }
            : null
        }
      />
    </div>
  )
}
