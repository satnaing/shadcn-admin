import type { Shop, Staff } from '@/types/api'
import { create } from 'zustand'

interface AppState {
  user: Staff | null
  shops: Shop[]
  activeShopId: string | null
  activeShop: Shop | null
  setUser: (user: Staff | null) => void
  setShops: (shops: Shop[]) => void
  setActiveShopId: (shopId: string | null) => void
  setActiveShop: (shop: Shop | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  shops: [],
  activeShopId: localStorage.getItem('activeShopId'),
  activeShop: null,
  setUser: (user) => set({ user }),
  setShops: (shops) => {
    const shopsArray = Array.isArray(shops) ? shops : []
    set((state) => ({
      shops: shopsArray,
      activeShop: state.activeShopId
        ? shopsArray.find((s) => s.id === state.activeShopId) || null
        : null,
    }))
  },
  setActiveShopId: (shopId) => {
    if (shopId) {
      localStorage.setItem('activeShopId', shopId)
    } else {
      localStorage.removeItem('activeShopId')
    }
    set((state) => ({
      activeShopId: shopId,
      activeShop: shopId
        ? (state.shops || []).find((s) => s.id === shopId) || null
        : null,
    }))
  },
  setActiveShop: (shop) =>
    set({
      activeShop: shop,
      activeShopId: shop?.id || null,
    }),
}))
