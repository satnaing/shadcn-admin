import { buildListQueryString } from '@/shared/utils/list-query-string'
import { api } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type {
  ApiMessageResponse,
  ApiPaginatedResponse,
  ApiResponse,
} from '@/api/types'
import type { ProductFormValues } from '@/features/preorder/data/preorder.schema'
import type {
  CommissionItem,
  ConversationDetail,
  ConversationItem,
  DashboardStats,
  DownloadLink,
  FaqItem,
  Lookups,
  NotificationTypeItem,
  OrderCounts,
  OrderDetail,
  OrderListItem,
  OrderStep,
  PreorderListParams,
  PreorderSettings,
  ProductFlag,
  ProductListItem,
  QueryItem,
  ReviewProductDetail,
  ReviewProductItem,
  StepPayload,
  TopProduct,
} from '@/features/preorder/data/preorder.type'

const E = ENDPOINTS.PREORDER
const qs = (params: PreorderListParams = {}) =>
  buildListQueryString({ ...params })
const list = <T>(url: string, params?: PreorderListParams) =>
  api.get<ApiPaginatedResponse<T[]>>(`${url}?${qs(params)}`)

export const preorderApi = {
  dashboard: () => api.get<ApiResponse<DashboardStats>>(E.DASHBOARD),
  topProducts: (owner?: string) =>
    api.get<ApiResponse<TopProduct[]>>(`${E.TOP_PRODUCTS}?${qs({ owner })}`),
  lookups: () => api.get<ApiResponse<Lookups>>(E.LOOKUPS),

  products: (params?: PreorderListParams) =>
    list<ProductListItem>(E.PRODUCTS, params),
  product: (id: number | string) =>
    api.get<ApiResponse<ProductFormValues & { id: number }>>(E.PRODUCT(id)),
  createProduct: (values: ProductFormValues) =>
    api.post<ApiMessageResponse>(E.PRODUCTS, values),
  updateProduct: (id: number | string, values: ProductFormValues) =>
    api.put<ApiMessageResponse>(E.PRODUCT(id), values),
  removeProduct: (id: number | string) =>
    api.delete<ApiMessageResponse>(E.PRODUCT(id)),
  bulkRemoveProducts: (ids: number[]) =>
    api.post<ApiMessageResponse>(E.PRODUCTS_BULK_DELETE, { ids }),
  setProductFlag: (id: number | string, flag: ProductFlag, value: boolean) =>
    api.patch<ApiMessageResponse>(E.PRODUCT_FLAGS(id), { flag, value }),

  orders: (params?: PreorderListParams) =>
    list<OrderListItem>(E.ORDERS, params),
  orderCounts: (scope?: string) =>
    api.get<ApiResponse<OrderCounts>>(`${E.ORDERS_COUNTS}?${qs({ scope })}`),
  order: (id: number | string) =>
    api.get<ApiResponse<OrderDetail>>(E.ORDER(id)),
  setStep: (id: number | string, step: OrderStep, payload: StepPayload) =>
    api.put<ApiMessageResponse>(E.ORDER_STEP(id, step), payload),
  removeOrder: (id: number | string) =>
    api.delete<ApiMessageResponse>(E.ORDER(id)),
  bulkRemoveOrders: (ids: number[]) =>
    api.post<ApiMessageResponse>(E.ORDERS_BULK_DELETE, { ids }),
  sendReminders: (ids: number[], type: 'prepayment' | 'final') =>
    api.post<ApiMessageResponse>(E.ORDERS_REMINDERS, { ids, type }),
  invoice: (id: number | string) =>
    api.get<ApiResponse<DownloadLink>>(E.ORDER_INVOICE(id)),

  commissions: (params?: PreorderListParams) =>
    list<CommissionItem>(E.COMMISSIONS, params),

  conversations: (params?: PreorderListParams) =>
    list<ConversationItem>(E.CONVERSATIONS, params),
  conversation: (id: number | string) =>
    api.get<ApiResponse<ConversationDetail>>(E.CONVERSATION(id)),
  replyConversation: (id: number | string, message: string) =>
    api.post<ApiMessageResponse>(E.CONVERSATION_REPLY(id), { message }),
  removeConversation: (id: number | string) =>
    api.delete<ApiMessageResponse>(E.CONVERSATION(id)),

  queries: (params?: PreorderListParams) => list<QueryItem>(E.QUERIES, params),
  replyQuery: (id: number | string, reply: string) =>
    api.put<ApiMessageResponse>(E.QUERY(id), { reply }),

  reviews: (params?: PreorderListParams) =>
    list<ReviewProductItem>(E.REVIEWS, params),
  reviewProduct: (id: number | string) =>
    api.get<ApiResponse<ReviewProductDetail>>(E.REVIEW_PRODUCT(id)),
  setReviewPublished: (id: number | string, is_published: boolean) =>
    api.patch<ApiMessageResponse>(E.REVIEW_STATUS(id), { is_published }),

  faqs: (params?: PreorderListParams) => list<FaqItem>(E.FAQS, params),
  createFaq: (values: unknown) => api.post<ApiMessageResponse>(E.FAQS, values),
  updateFaq: (id: number | string, values: unknown) =>
    api.put<ApiMessageResponse>(E.FAQ(id), values),
  removeFaq: (id: number | string) => api.delete<ApiMessageResponse>(E.FAQ(id)),
  setFaqActive: (id: number | string, is_active: boolean) =>
    api.patch<ApiMessageResponse>(E.FAQ_STATUS(id), { is_active }),

  notificationTypes: (params?: PreorderListParams) =>
    list<NotificationTypeItem>(E.NOTIFICATION_TYPES, params),
  updateNotificationType: (id: number | string, values: unknown) =>
    api.put<ApiMessageResponse>(E.NOTIFICATION_TYPE(id), values),
  setNotificationActive: (id: number | string, is_active: boolean) =>
    api.patch<ApiMessageResponse>(E.NOTIFICATION_TYPE(id), { is_active }),

  settings: () => api.get<ApiResponse<PreorderSettings>>(E.SETTINGS),
  updateSettings: (values: PreorderSettings) =>
    api.put<ApiMessageResponse>(E.SETTINGS, values),
}
