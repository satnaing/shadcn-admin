import { useQuery } from '@tanstack/react-query'
import { preorderApi } from '@/api/modules/preorder.api'
import { usePaginatedQuery } from '@/hooks/use-paginated-query'
import type { PreorderListParams } from '../data/preorder.type'

export const preorderKeys = {
  all: ['PREORDER'] as const,
  list: (name: string, p?: PreorderListParams) =>
    [...preorderKeys.all, name, p] as const,
  one: (name: string, id: number | string) =>
    [...preorderKeys.all, name, 'one', id] as const,
}

const k = preorderKeys

export const usePreorderDashboard = () =>
  useQuery({ queryKey: k.list('dashboard'), queryFn: preorderApi.dashboard })

export const useTopProducts = (owner?: string) =>
  useQuery({
    queryKey: k.list('top-products', { owner }),
    queryFn: () => preorderApi.topProducts(owner),
  })

export const usePreorderLookups = () =>
  useQuery({
    queryKey: k.list('lookups'),
    queryFn: preorderApi.lookups,
    staleTime: 60_000,
  })

export const useProducts = (p?: PreorderListParams) =>
  usePaginatedQuery({
    queryKey: k.list('products', p),
    queryFn: () => preorderApi.products(p),
  })

export const useProduct = (id?: number | string) =>
  useQuery({
    queryKey: k.one('product', id ?? ''),
    queryFn: () => preorderApi.product(id ?? ''),
    enabled: !!id,
  })

export const useOrders = (p?: PreorderListParams) =>
  usePaginatedQuery({
    queryKey: k.list('orders', p),
    queryFn: () => preorderApi.orders(p),
  })

export const useOrderCounts = (scope?: string) =>
  useQuery({
    queryKey: k.list('order-counts', { scope }),
    queryFn: () => preorderApi.orderCounts(scope),
  })

export const useOrder = (id?: number | string) =>
  useQuery({
    queryKey: k.one('order', id ?? ''),
    queryFn: () => preorderApi.order(id ?? ''),
    enabled: !!id,
  })

export const useCommissions = (p?: PreorderListParams) =>
  usePaginatedQuery({
    queryKey: k.list('commissions', p),
    queryFn: () => preorderApi.commissions(p),
  })

export const useConversations = (p?: PreorderListParams) =>
  usePaginatedQuery({
    queryKey: k.list('conversations', p),
    queryFn: () => preorderApi.conversations(p),
  })

export const useConversation = (id?: number | string) =>
  useQuery({
    queryKey: k.one('conversation', id ?? ''),
    queryFn: () => preorderApi.conversation(id ?? ''),
    enabled: !!id,
  })

export const useQueries = (p?: PreorderListParams) =>
  usePaginatedQuery({
    queryKey: k.list('queries', p),
    queryFn: () => preorderApi.queries(p),
  })

export const useReviews = (p?: PreorderListParams) =>
  usePaginatedQuery({
    queryKey: k.list('reviews', p),
    queryFn: () => preorderApi.reviews(p),
  })

export const useReviewProduct = (id?: number | string) =>
  useQuery({
    queryKey: k.one('review-product', id ?? ''),
    queryFn: () => preorderApi.reviewProduct(id ?? ''),
    enabled: !!id,
  })

export const useFaqs = (p?: PreorderListParams) =>
  usePaginatedQuery({
    queryKey: k.list('faqs', p),
    queryFn: () => preorderApi.faqs(p),
  })

export const useNotificationTypes = (p?: PreorderListParams) =>
  usePaginatedQuery({
    queryKey: k.list('notification-types', p),
    queryFn: () => preorderApi.notificationTypes(p),
  })

export const usePreorderSettings = () =>
  useQuery({ queryKey: k.list('settings'), queryFn: preorderApi.settings })
