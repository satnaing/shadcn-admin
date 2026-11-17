import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { mapProviderApi } from '@/api/modules/map-provider.api'
import type { MapLocation, MapSettings } from '../data/map-provider.type'

const KEY = ['MAP_PROVIDER'] as const

export const useMapProvider = () => useQuery({ queryKey: KEY, queryFn: mapProviderApi.get })

/** The two forms save independently (AEC had two separate forms); each refetches the page data and toasts. */
export function useMapProviderMutations() {
  const { t } = useTranslation('map_provider')
  const qc = useQueryClient()
  const options = {
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY })
      toast.success(t('toast.saved'))
    },
    onError: () => toast.error(t('toast.error')),
  }

  return {
    saveSettings: useMutation({ mutationFn: (v: MapSettings) => mapProviderApi.saveSettings(v), ...options }),
    saveLocation: useMutation({ mutationFn: (v: MapLocation) => mapProviderApi.saveLocation(v), ...options }),
  }
}
