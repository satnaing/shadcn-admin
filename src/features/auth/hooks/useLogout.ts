import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { authService } from '../data/auth.service'
import { useAuthStore } from '../data/auth.store'

export const useLogout = () => {
  const { clean } = useAuthStore.getState()
  const navigate = useNavigate()

  const { data, mutateAsync, isPending } = useMutation({
    mutationFn: authService.logout,
    mutationKey: ['LOGOUT'],
    onSuccess: () => {
      clean()
      navigate({ to: '/sign-in' })
    },
  })

  return {
    data,
    mutate: mutateAsync,
    isLoading: isPending,
  }
}
