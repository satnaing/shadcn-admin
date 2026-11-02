import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useBlogCategories } from './hooks/useMarketing'
import { useMarketingMutations } from './hooks/useMarketingMutations'

export function BlogCreatePage() {
  const navigate = useNavigate()
  const { data: categories = [] } = useBlogCategories()
  const { saveBlog } = useMarketingMutations()

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [categoryId, setCategoryId] = useState<string>('')
  const [banner, setBanner] = useState('')
  const [shortDesc, setShortDesc] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState(true)

  const handleTitleChange = (val: string) => {
    setTitle(val)
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cat = categories.find((c: { id: number; name: string }) => String(c.id) === categoryId)
    saveBlog.mutate(
      {
        title,
        slug,
        category_id: Number(categoryId),
        category_name: cat?.name ?? '',
        banner,
        short_description: shortDesc,
        content,
        status,
      },
      {
        onSuccess: () => navigate({ to: '/admin/marketing/blogs' }),
      }
    )
  }

  return (
    <>
      <AdminHeader />
      <Main className='p-6 space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Yeni Bloq Məqaləsi</h1>
            <p className='text-sm text-muted-foreground'>
              Yeni məqalə yazın və dərc edin
            </p>
          </div>
          <Button variant='outline' size='sm' asChild>
            <Link to='/admin/marketing/blogs'>
              <ArrowLeft className='mr-2 h-4 w-4' /> Geri
            </Link>
          </Button>
        </div>
        <form onSubmit={handleSubmit} className='grid gap-6 lg:grid-cols-3'>
          <div className='space-y-6 lg:col-span-2'>
            <Card>
              <CardHeader><CardTitle className='text-base'>Məzmun Məlumatları</CardTitle></CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-1.5'>
                  <Label>Məqalə Başlığı</Label>
                  <Input value={title} onChange={(e) => handleTitleChange(e.target.value)} required />
                </div>
                <div className='space-y-1.5'>
                  <Label>Slug</Label>
                  <Input value={slug} onChange={(e) => setSlug(e.target.value)} required />
                </div>
                <div className='space-y-1.5'>
                  <Label>Qısa Açıqlama</Label>
                  <Textarea rows={2} value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} required />
                </div>
                <div className='space-y-1.5'>
                  <Label>Ətraflı Məzmun</Label>
                  <Textarea rows={8} value={content} onChange={(e) => setContent(e.target.value)} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className='space-y-6'>
            <Card>
              <CardHeader><CardTitle className='text-base'>Təsnifat və Banner</CardTitle></CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-1.5'>
                  <Label>Kateqoriya</Label>
                  <Select value={categoryId} onValueChange={setCategoryId} required>
                    <SelectTrigger><SelectValue placeholder='Seçin' /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c: { id: number; name: string }) => (
                        <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-1.5'>
                  <Label>Banner Şəkli (URL)</Label>
                  <Input value={banner} onChange={(e) => setBanner(e.target.value)} placeholder='https://...' />
                </div>
                <div className='flex items-center justify-between pt-2'>
                  <Label>Dərc edilsin</Label>
                  <Switch checked={status} onCheckedChange={setStatus} />
                </div>
                <Button type='submit' className='w-full' disabled={saveBlog.isPending}>
                  {saveBlog.isPending ? 'Saxlanılır...' : 'Dərc Et'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </Main>
    </>
  )
}
