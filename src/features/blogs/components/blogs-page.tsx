import { Link } from '@tanstack/react-router'
import { FolderTree, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { PermissionGuard } from '@/components/guard'
import { Button } from '@/components/ui/button'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { PERMISSIONS } from '@/shared/permissions'
import { BlogsTable } from './blogs-table'

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function BlogsPage({ search, navigate }: Props) {
  const { t } = useTranslation('blogs')

  return (
    <AdminPageShell
      title={t('list.title')}
      description={t('list.description')}
      actions={
        <div className='flex gap-2'>
          <PermissionGuard permission={PERMISSIONS.BLOGS.CATEGORIES}>
            <Button asChild variant='outline'>
              <Link to='/admin/blogs/categories'>
                <FolderTree className='me-2 size-4' />
                {t('list.categories')}
              </Link>
            </Button>
          </PermissionGuard>
          <PermissionGuard permission={PERMISSIONS.BLOGS.CREATE}>
            <Button asChild>
              <Link to='/admin/blogs/new'>
                <Plus className='me-2 size-4' />
                {t('list.new')}
              </Link>
            </Button>
          </PermissionGuard>
        </div>
      }
    >
      <BlogsTable search={search} navigate={navigate} />
    </AdminPageShell>
  )
}
