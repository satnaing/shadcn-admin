import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { blogsApi } from '@/api/cms/blogs.api'
import { blogKeys } from './use-blogs'

type Edit = { id: number | string; values: unknown }

export function useBlogMutations() {
  const { t } = useTranslation('blogs')
  const qc = useQueryClient()
  const onError = () => toast.error(t('toast.error'))
  const done = (key: string) => () => {
    qc.invalidateQueries({ queryKey: blogKeys.all })
    toast.success(t(key))
  }

  return {
    create: useMutation({ mutationFn: blogsApi.create, onSuccess: done('toast.created'), onError }),
    update: useMutation({
      mutationFn: ({ id, values }: Edit) => blogsApi.update(id, values),
      onSuccess: done('toast.updated'),
      onError,
    }),
    remove: useMutation({ mutationFn: blogsApi.remove, onSuccess: done('toast.deleted'), onError }),
    createCategory: useMutation({
      mutationFn: blogsApi.createCategory,
      onSuccess: done('toast.created'),
      onError,
    }),
    updateCategory: useMutation({
      mutationFn: ({ id, values }: Edit) => blogsApi.updateCategory(id, values),
      onSuccess: done('toast.updated'),
      onError,
    }),
    removeCategory: useMutation({
      mutationFn: blogsApi.removeCategory,
      onSuccess: done('toast.deleted'),
      onError,
    }),
  }
}
