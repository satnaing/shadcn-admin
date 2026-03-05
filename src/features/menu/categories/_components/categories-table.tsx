import { DataTable } from '@/components/custom/data-table'
// import { type Category } from '../data/mock-categories' // Removing mock import, let's infer or import real type?
// Ideally we should import Category type from API types, but columns definition might rely on mock type or be compatible.
// Let's check api.ts again or just use 'any' for now if specific type isn't exported from columns.
// Actually, let's import the specific type if possible.
import { type Category } from '../../data/schema'
import { columns } from './categories-columns.tsx'

// Keeping this for now as columns probably use it, but typically we should switch to API type.
// Wait, if I change the data source, I should ensure the type matches.
// The API 'Category' might differ from mock 'Category'.
// API Category has `name: LocalizedText`, mock likely same.
// Let's stick to the prop interface change first.

interface CategoriesTableProps {
  data: Category[]
  onEdit: (category: Category) => void
  pageCount?: number
  pagination?: {
    pageIndex: number
    pageSize: number
  }
  onPaginationChange?: (pagination: {
    pageIndex: number
    pageSize: number
  }) => void
}

export function CategoriesTable({
  data,
  onEdit,
  pageCount,
  pagination,
  onPaginationChange,
}: CategoriesTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder='Filter categories...'
      meta={{ onEdit }}
      pageCount={pageCount}
      pagination={pagination}
      onPaginationChange={onPaginationChange}
    />
  )
}
