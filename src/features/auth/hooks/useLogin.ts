import { useMutation } from '@tanstack/react-query'
import { authService } from '../data/auth.service'
import { useAuthStore } from '../data/auth.store'

export const useLogin = () => {
  const { setAccessToken } = useAuthStore.getState()
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: authService.login,
    mutationKey: ['AUTH'],
    onSuccess: (res) => {
      if (res?.token) {
        setAccessToken(res.token)
      }
    },
  })

  return {
    data,
    mutate: mutateAsync,
    isLoading: isPending,
  }
}
