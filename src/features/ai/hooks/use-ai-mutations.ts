import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { aiApi } from '@/api/modules/ai.api'
import type { ContentAiSettings, TranslateAiSettings } from '../data/ai.type'
import { aiKeys } from './use-ai'

/** Wraps a mutation: refetch every module query on success and toast. */
function useAction<V>(fn: (v: V) => Promise<unknown>, onDone?: () => void) {
  const { t } = useTranslation('ai')
  const qc = useQueryClient()

  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: aiKeys.all })
      toast.success(t('toast.saved'))
      onDone?.()
    },
    onError: () => toast.error(t('toast.error')),
  })
}

export function useAiMutations(onPromptSaved?: () => void) {
  return {
    saveContent: useAction((v: ContentAiSettings) => aiApi.saveContent(v)),
    saveTranslate: useAction((v: TranslateAiSettings) => aiApi.saveTranslate(v)),
    savePrompt: useAction((v: { id: number; prompt: string }) => aiApi.savePrompt(v.id, v.prompt), onPromptSaved),
  }
}
