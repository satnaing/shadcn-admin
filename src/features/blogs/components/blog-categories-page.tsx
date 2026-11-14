import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { Button } from '@/components/ui/button'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { useBlogCategory } from '../hooks/use-blogs'
import { BlogCategoriesTable } from './blog-categories-table'
import { BlogCategoryDialog } from './blog-category-dialog'

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

/** `editing`: `0` = creating, an id = editing, `null` = closed. */
export function BlogCategoriesPage({ search, navigate }: Props) {
  const { t } = useTranslation('blogs')
  const [editing, setEditing] = useState<number | null>(null)
  const { data } = useBlogCategory(editing || undefined)
  const ready = editing === 0 || (editing !== null && !!data)

  return (
    <AdminPageShell
      title={t('categories.title')}
      description={t('categories.description')}
      actions={
        <div className='flex gap-2'>
          <Button asChild variant='outline'>
            <Link to='/admin/blogs'>
              <ArrowLeft className='me-2 size-4' />
              {t('categories.back')}
            </Link>
          </Button>
          <Button onClick={() => setEditing(0)}>
            <Plus className='me-2 size-4' />
            {t('categories.new')}
          </Button>
        </div>
      }
    >
      <BlogCategoriesTable search={search} navigate={navigate} onEdit={setEditing} />
      {ready && (
        <BlogCategoryDialog
          key={editing}
          open
          onOpenChange={(open) => !open && setEditing(null)}
          category={editing ? data?.data : undefined}
        />
      )}
    </AdminPageShell>
  )
}
