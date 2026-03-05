import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getMyShops, getProfile } from '@/services/context'
import { toast } from 'sonner'
import { useAppStore } from '@/hooks/use-app-store'

export const useBootstrap = () => {
  const { setUser, setShops, setActiveShopId } = useAppStore()

  const { data: user, error: userError } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    retry: 1,
  })

  const { data: shops, error: shopsError } = useQuery({
    queryKey: ['my-shops'],
    queryFn: getMyShops,
    retry: 1,
  })

  useEffect(() => {
    if (user) {
      setUser(user)
    }
  }, [user, setUser])

  useEffect(() => {
    if (shops) {
      const shopsArray = Array.isArray(shops) ? shops : []
      setShops(shopsArray)

      // Auto-select Default Shop
      // This runs when shops are loaded or changed
      const currentActiveId = localStorage.getItem('activeShopId')

      // If we have a stored ID and it exists in the fetched shops, use it
      if (currentActiveId && shopsArray.find((s) => s.id === currentActiveId)) {
        setActiveShopId(currentActiveId)
      } else if (shopsArray.length > 0) {
        // Otherwise default to the first shop
        setActiveShopId(shopsArray[0].id)
      } else {
        // No shops available
        setActiveShopId(null)
      }
    }
  }, [shops, setShops, setActiveShopId])

  useEffect(() => {
    if (userError || shopsError) {
      toast.error('Failed to load application data')
    }
  }, [userError, shopsError])

  const isBootstrapped = !!user && !!shops

  return { isBootstrapped }
}
