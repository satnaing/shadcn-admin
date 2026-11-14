import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import i18next from 'i18next'
import { toast } from 'sonner'
import type { CurrencyFormValues } from '../data/settings.schema'
import { settingsKeys, settingsService } from '../data/settings.service'

export const useCurrencies = () =>
  useQuery({ queryKey: settingsKeys.currencies(), queryFn: settingsService.currencies })

export const useCurrencyMutations = () => {
  const queryClient = useQueryClient()
  const refresh = () => {
    // the shell's money formatter reads the default currency under its own key
    void queryClient.invalidateQueries({ queryKey: ['CURRENCY'] })
    return queryClient.invalidateQueries({ queryKey: settingsKeys.currencies() })
  }
  const onError = () => toast.error(i18next.t('settings:common.saveError'))

  return {
    create: useMutation({
      mutationFn: (values: CurrencyFormValues) => settingsService.createCurrency(values),
      onSuccess: refresh,
      onError,
    }),
    update: useMutation({
      mutationFn: ({ id, values }: { id: number; values: Partial<CurrencyFormValues> & { is_default?: boolean } }) =>
        settingsService.updateCurrency(id, values),
      onSuccess: refresh,
      onError,
    }),
    remove: useMutation({
      mutationFn: (id: number) => settingsService.deleteCurrency(id),
      onSuccess: refresh,
      onError,
    }),
  }
}
