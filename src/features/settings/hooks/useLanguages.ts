import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import i18next from 'i18next'
import { toast } from 'sonner'
import { settingsKeys, settingsService } from '../data/settings.service'
import type { LanguagePatch } from '../data/settings.type'

export const useLanguages = () =>
  useQuery({ queryKey: settingsKeys.languages(), queryFn: settingsService.languages })

export const usePatchLanguage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, patch }: { id: number; patch: LanguagePatch }) =>
      settingsService.patchLanguage(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: settingsKeys.languages() }),
    onError: () => toast.error(i18next.t('settings:common.saveError')),
  })
}
