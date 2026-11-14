import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import i18next from 'i18next'
import { toast } from 'sonner'
import { settingsKeys, settingsService } from '../data/settings.service'
import type { GroupValues, SettingsGroup } from '../data/settings.type'

export const useSettingsGroup = (group: SettingsGroup) =>
  useQuery({
    queryKey: settingsKeys.group(group),
    queryFn: () => settingsService.getGroup(group),
  })

export const useSaveSettingsGroup = (group: SettingsGroup) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: GroupValues) => settingsService.saveGroup(group, values),
    onSuccess: () => {
      toast.success(i18next.t('settings:common.saved'))
      return queryClient.invalidateQueries({ queryKey: settingsKeys.group(group) })
    },
    onError: () => toast.error(i18next.t('settings:common.saveError')),
  })
}
