import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Badge } from '@/components/ui/badge'
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
import { BlogCategoryDialog } from './components/blog-category-dialog'
import type { BlogCategory } from './data/marketing.type'
import { useBlogCategories } from './hooks/useMarketing'
import { useMarketingMutations } from './hooks/useMarketingMutations'

export function BlogCategoriesPage() {
  const { data: categories = [], isLoading } = useBlogCategories()
  const { saveBlogCategory } = useMarketingMutations()
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleEdit = (cat: BlogCategory) => {
    setSelectedCategory(cat)
    setDialogOpen(true)
  }

  const handleCreate = () => {
    setSelectedCategory(null)
    setDialogOpen(true)
  }

  return (
    <>
      <AdminHeader />
      <Main className='space-y-4 p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Bloq Kateqoriyaları</h1>
            <p className='text-sm text-muted-foreground'>
              Bloq yazılarını qruplaşdırmaq üçün kateqoriyalar
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className='mr-2 h-4 w-4' /> Yeni Kateqoriya
          </Button>
        </div>
        <div className='rounded-md border bg-card'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ad</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className='text-center'>Məqalə Sayı</TableHead>
                <TableHead className='text-center'>Status</TableHead>
                <TableHead className='text-right'>Əməliyyatlar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className='py-8 text-center text-sm text-muted-foreground'>
                    Yüklənir...
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((c: BlogCategory) => (
                  <TableRow key={c.id}>
                    <TableCell className='font-medium'>{c.name}</TableCell>
                    <TableCell className='text-sm text-muted-foreground'>{c.slug}</TableCell>
                    <TableCell className='text-center'>
                      <Badge variant='outline'>{c.posts_count}</Badge>
                    </TableCell>
                    <TableCell className='text-center'>
                      <Switch
                        checked={c.status}
                        onCheckedChange={() => saveBlogCategory.mutate({ id: c.id, status: !c.status })}
                      />
                    </TableCell>
                    <TableCell className='text-right space-x-1'>
                      <Button variant='ghost' size='icon' onClick={() => handleEdit(c)}>
                        <Pencil className='h-4 w-4' />
                      </Button>
                      <Button variant='ghost' size='icon' className='text-destructive'>
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <BlogCategoryDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          initialData={selectedCategory}
          onSubmit={(d) => saveBlogCategory.mutate(d)}
        />
      </Main>
    </>
  )
}
