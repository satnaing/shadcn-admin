import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { mediaApi } from '@/api/modules/media.api'

const KEY = ['media'] as const

export const useMediaList = (params: { q?: string; type?: string; page?: number }, enabled = true) =>
  useQuery({ queryKey: [...KEY, params], queryFn: () => mediaApi.list(params), enabled, placeholderData: keepPreviousData })

export function useMediaMutations() {
  const qc = useQueryClient()
  const refresh = () => qc.invalidateQueries({ queryKey: KEY })

  return {
    upload: useMutation({ mutationFn: (file: File) => mediaApi.upload(file), onSuccess: refresh }),
    remove: useMutation({ mutationFn: (id: number) => mediaApi.remove(id), onSuccess: refresh }),
  }
}
