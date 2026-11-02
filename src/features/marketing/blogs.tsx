import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { BlogsTable } from './components/blogs-table'
import { useBlogs } from './hooks/useMarketing'
import { useMarketingMutations } from './hooks/useMarketingMutations'

export function BlogsPage() {
  const { data: blogs = [], isLoading } = useBlogs()
  const { saveBlog, deleteBlog } = useMarketingMutations()

  return (
    <>
      <AdminHeader />
      <Main className='space-y-4 p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Bütün Bloq Məqalələri</h1>
            <p className='text-sm text-muted-foreground'>
              Məzmun marketinqi və SEO bloq yazıları
            </p>
          </div>
          <Button asChild>
            <Link to='/admin/marketing/blogs/create'>
              <Plus className='mr-2 h-4 w-4' /> Yeni Məqalə
            </Link>
          </Button>
        </div>
        {isLoading ? (
          <div className='py-8 text-center text-sm text-muted-foreground'>Yüklənir...</div>
        ) : (
          <BlogsTable
            blogs={blogs}
            onEdit={() => {}}
            onToggle={(b) => saveBlog.mutate({ id: b.id, status: !b.status })}
            onDelete={(id) => deleteBlog.mutate(id)}
          />
        )}
      </Main>
    </>
  )
}
