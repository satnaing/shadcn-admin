import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { pagesApi } from '@/api/cms/pages.api'
import type { PageSection, PageSettingsPayload } from '../data/pages.type'
import { pageKeys } from './usePages'

export function usePageMutations() {
  const { t } = useTranslation('pages')
  const client = useQueryClient()
  const refresh = () => client.invalidateQueries({ queryKey: pageKeys.all })
  const notify = (key: string) => () => {
    toast.success(t(key))
    return refresh()
  }

  return {
    create: useMutation({ mutationFn: pagesApi.create, onSuccess: notify('toast.created') }),
    update: useMutation({
      mutationFn: ({ id, payload }: { id: number; payload: PageSettingsPayload }) =>
        pagesApi.update(id, payload),
      onSuccess: notify('toast.updated'),
    }),
    remove: useMutation({ mutationFn: pagesApi.remove, onSuccess: notify('toast.deleted') }),
    publish: useMutation({ mutationFn: pagesApi.publish, onSuccess: notify('toast.published') }),
    restore: useMutation({
      mutationFn: ({ id, revisionId }: { id: number; revisionId: number }) =>
        pagesApi.restore(id, revisionId),
      onSuccess: notify('toast.restored'),
    }),
    previewToken: useMutation({ mutationFn: pagesApi.previewToken }),
  }
}

/** Autosave stays silent: no toast, no list refetch. */
export const useSaveDraft = () =>
  useMutation({
    mutationFn: ({ id, sections }: { id: number; sections: PageSection[] }) =>
      pagesApi.saveDraft(id, sections),
  })
