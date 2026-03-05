import {
  type Order,
  type GetOrdersFilters,
  type UpdateOrderStatusRequest,
  type CreateOrderRequest,
  type InventoryItem,
  type AdjustStockRequest,
  type PaginationMeta,
} from '@/types/api'
import { type KdsBoardState } from '@/types/kds'
import {
  type StaffShift,
  type CashDrawerSession,
  type StartShiftRequest,
  type EndShiftRequest,
  type OpenDrawerRequest,
  type CloseDrawerRequest,
  type GetShiftsFilters,
} from '@/types/ops'
import { apiClient } from '@/lib/api-client'

export const startShift = async (
  data: StartShiftRequest
): Promise<StaffShift> => {
  const response = await apiClient.post('/admin/shifts/start', data)
  return response.data
}

export const endShift = async (data: EndShiftRequest): Promise<StaffShift> => {
  const response = await apiClient.post('/admin/shifts/end', data)
  return response.data
}

export const getCurrentShift = async (): Promise<StaffShift | null> => {
  const response = await apiClient.get('/admin/shifts/current')
  return response.data
}

// Cash Drawer
export const openDrawer = async (
  data: OpenDrawerRequest
): Promise<CashDrawerSession> => {
  const response = await apiClient.post('/admin/cash-drawer/open', data)
  return response.data
}

export const closeDrawer = async (
  data: CloseDrawerRequest
): Promise<CashDrawerSession> => {
  const response = await apiClient.post('/admin/cash-drawer/close', data)
  return response.data
}

export const getCurrentDrawerSession = async (
  shopId: string
): Promise<CashDrawerSession | null> => {
  const response = await apiClient.get(
    `/admin/shops/${shopId}/cash-drawer/current`
  )
  return response.data
}

// KDS Board API
export const getKdsOrders = async (shopId: string): Promise<KdsBoardState> => {
  const response = await apiClient.get(`/admin/shops/${shopId}/kds`)
  return response.data
}

// Orders
export const getOrders = async (
  filters?: GetOrdersFilters
): Promise<{ data: Order[]; meta: PaginationMeta }> => {
  const response = await apiClient.get('/admin/orders', { params: filters })
  const rawData = response.data?.items || response.data?.data || []

  const orders = rawData.map((order: unknown) => ({
    ...(order as any),
    status: (order as any).status?.toUpperCase(), // Ensure status matches enum
    items: ((order as any).items || []).map((item: unknown) => ({
      ...(item as any),
      // Flatten name for frontend consistency
      name:
        typeof (item as any).name === 'string'
          ? (item as any).name
          : (item as any).name?.en || (item as any).name?.km || 'Item',
      options: ((item as any).options || []).map((opt: unknown) => ({
        ...(opt as any),
        name:
          typeof (opt as any).name === 'string'
            ? (opt as any).name
            : (opt as any).name?.en || (opt as any).name?.km || 'Option',
      })),
    })),
  }))
  return {
    data: orders,
    meta: {
      totalItems: response.data?.meta?.totalItems ?? 0,
      itemCount: response.data?.meta?.itemCount ?? 0,
      itemsPerPage: response.data?.meta?.itemsPerPage ?? 10,
      totalPages: response.data?.meta?.totalPages ?? 1,
      currentPage: response.data?.meta?.currentPage ?? 1,
    },
  }
}

export const createOrder = async (data: CreateOrderRequest): Promise<Order> => {
  const response = await apiClient.post(
    `/admin/orders/shops/${data.shopId}`,
    data
  )
  return response.data
}

export const updateOrderStatus = async (
  id: string,
  data: UpdateOrderStatusRequest
): Promise<Order> => {
  const response = await apiClient.patch(`/admin/orders/${id}/status`, data)
  return response.data
}

// Inventory
// Note: Endpoint paths inferred as they were missing from the provided spec snippet for shop-specific inventory.
export const getInventory = async (
  shopId: string
): Promise<InventoryItem[]> => {
  const response = await apiClient.get(`/admin/shops/${shopId}/inventory`)
  return response.data
}

export const adjustStock = async (data: AdjustStockRequest): Promise<void> => {
  const response = await apiClient.post('/admin/inventory/adjust', data)
  return response.data
}

export const getShifts = async (
  filters: GetShiftsFilters
): Promise<{ data: StaffShift[]; meta: PaginationMeta }> => {
  const response = await apiClient.get('/admin/shifts', { params: filters })
  return {
    data: response.data?.items || response.data?.data || [],
    meta: {
      totalItems: response.data?.meta?.totalItems ?? 0,
      itemCount: response.data?.meta?.itemCount ?? 0,
      itemsPerPage: response.data?.meta?.itemsPerPage ?? 10,
      totalPages: response.data?.meta?.totalPages ?? 1,
      currentPage: response.data?.meta?.currentPage ?? 1,
    },
  }
}
