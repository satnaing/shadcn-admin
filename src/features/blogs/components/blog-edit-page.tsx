import { useBlog } from '../hooks/use-blogs'
import { BlogForm } from './blog-form'

export function BlogEditPage({ id }: { id: string }) {
  const { data } = useBlog(id)
  if (!data) return <div className='p-6' aria-busy='true' />

  return <BlogForm key={data.data.id} blog={data.data} />
}
