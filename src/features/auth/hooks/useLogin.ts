import { useMutation } from '@tanstack/react-query'
import { authService } from '../data/auth.service'
import { useAuthStore } from '../data/auth.store'

export const useLogin = () => {
  const { setAccessToken, setUser } = useAuthStore.getState()
  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: authService.login,
    mutationKey: ['AUTH'],
    onSuccess: (res) => {
      if (res?.token) {
        setAccessToken(res.token)
      }
      if (res?.user) {
        setUser({
          ...res.user,
          roles: [{ id: 1, name: 'admin' }],
          role: 'admin',
          seller_id: null,
          panel: 'admin',
        })
      }
    },
  })

  return {
    data,
    mutate: mutateAsync,
    isLoading: isPending,
  }
}
