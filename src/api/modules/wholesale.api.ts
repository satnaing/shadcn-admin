import { buildListQueryString } from '@/shared/utils/list-query-string'
import { api } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type {
  ApiMessageResponse,
  ApiPaginatedResponse,
  ApiResponse,
} from '@/api/types'
import type { ProductFormValues } from '@/features/wholesale/data/wholesale.schema'
import type {
  ProductFlag,
  WholesaleListParams,
  WholesaleLookups,
  WholesaleProduct,
} from '@/features/wholesale/data/wholesale.type'

const E = ENDPOINTS.WHOLESALE

export const wholesaleApi = {
  lookups: () => api.get<ApiResponse<WholesaleLookups>>(E.LOOKUPS),
  products: (params: WholesaleListParams = {}) =>
    api.get<ApiPaginatedResponse<WholesaleProduct[]>>(
      `${E.PRODUCTS}?${buildListQueryString({ ...params })}`
    ),
  product: (id: number | string) =>
    api.get<ApiResponse<ProductFormValues & { id: number }>>(E.PRODUCT(id)),
  createProduct: (values: ProductFormValues) =>
    api.post<ApiMessageResponse>(E.PRODUCTS, values),
  updateProduct: (id: number | string, values: ProductFormValues) =>
    api.put<ApiMessageResponse>(E.PRODUCT(id), values),
  removeProduct: (id: number | string) =>
    api.delete<ApiMessageResponse>(E.PRODUCT(id)),
  removeProducts: (ids: number[]) =>
    api.post<ApiMessageResponse>(E.PRODUCTS_DELETE, { ids }),
  setFlag: (id: number | string, flag: ProductFlag, value: boolean) =>
    api.patch<ApiMessageResponse>(E.PRODUCT_FLAG(id), { flag, value }),
}
