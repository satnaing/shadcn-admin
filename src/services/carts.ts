import { apiClient } from '@/lib/api-client'
import type { Cart } from '@/features/operations/data/cart-schema'

export const getActiveCarts = async (shopId: string): Promise<Cart[]> => {
  const response = await apiClient.get('/cart', {
    params: { shopId },
  })

  // Map the backend payload into the Cart interface format expected by the frontend
  const rawCarts = response.data?.data || []

  return rawCarts.map(
    (c: {
      id: string
      userId: string
      user?: { fullName: string; phone: string }
      cartItems?: any[]
      updatedAt: string
      createdAt: string
    }) => {
      return {
        id: c.id,
        user: {
          id: c.userId,
          fullName: c.user?.fullName,
          phone: c.user?.phone || 'No Phone',
        },
        items: (c.cartItems || []).map(
          (item: {
            id: string
            productId: string
            product?: { name?: { en?: string }; price?: number }
            quantity: number
            choiceDetails?: { name: { en?: string } | string; price: number }[]
            instructions?: string
          }) => {
            // Find the effective price, or fallback to the parent product's price
            const unitPrice = item.product?.price || 0

            return {
              id: item.id,
              productId: item.productId,
              productName: item.product?.name?.en || 'Unknown Product',
              quantity: item.quantity,
              unitPrice: unitPrice,
              options:
                item.choiceDetails?.map(
                  (cd: { name: { en?: string } | string; price: number }) => ({
                    name: 'Option', // The backend schema simplification for choiceDetails doesn't return the parent OptionGroup name easily here, just the choice
                    value:
                      typeof cd.name === 'object'
                        ? cd.name?.en || 'Unknown'
                        : cd.name,
                    price: cd.price,
                  })
                ) || [],
              instructions: item.instructions || undefined,
            }
          }
        ),
        updatedAt: new Date(c.updatedAt),
        createdAt: new Date(c.createdAt),
      }
    }
  )
}
