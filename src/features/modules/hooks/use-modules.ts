import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { modulesApi } from '@/api/modules.api'
import type { ModuleChange } from '@/api/modules.types'
import { MENU_KEY } from '@/hooks/use-module-menu'

export const MODULES_KEY = ['MODULES'] as const

export const useModules = () => useQuery({ queryKey: MODULES_KEY, queryFn: modulesApi.list })

/** Every module write refreshes the list and the sidebar (module groups come from `admin_menu`). */
export function useModuleMutations() {
  const { t } = useTranslation('modules')
  const qc = useQueryClient()
  const refresh = (message: string) => () => {
    qc.invalidateQueries({ queryKey: MODULES_KEY })
    qc.invalidateQueries({ queryKey: MENU_KEY })
    toast.success(t(message))
  }
  const onError = () => toast.error(t('toast.error'))

  return {
    save: useMutation({
      mutationFn: (changes: ModuleChange[]) => modulesApi.saveBatch(changes),
      onSuccess: refresh('toast.saved'),
      onError,
    }),
    update: useMutation({ mutationFn: modulesApi.update, onSuccess: refresh('toast.updated'), onError }),
    remove: useMutation({ mutationFn: modulesApi.remove, onSuccess: refresh('toast.deleted'), onError }),
    upload: useMutation({
      mutationFn: modulesApi.upload,
      onSuccess: (res) => res.data.installed && refresh('toast.installed')(),
      onError,
    }),
  }
}
