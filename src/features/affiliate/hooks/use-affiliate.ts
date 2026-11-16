import { useQuery } from '@tanstack/react-query'
import { affiliateApi } from '@/api/modules/affiliate.api'
import { usePaginatedQuery } from '@/hooks/use-paginated-query'
import type {
  AffiliateListKind,
  AffiliateListParams,
} from '../data/affiliate.type'

export const affiliateKeys = {
  all: ['AFFILIATE'] as const,
  list: (kind: AffiliateListKind, p?: AffiliateListParams) =>
    [...affiliateKeys.all, 'list', kind, p] as const,
  settings: () => [...affiliateKeys.all, 'settings'] as const,
  options: () => [...affiliateKeys.all, 'options'] as const,
  form: () => [...affiliateKeys.all, 'form'] as const,
  user: (id: number | string) => [...affiliateKeys.all, 'user', id] as const,
  payments: (id: number | string) =>
    [...affiliateKeys.all, 'payments', id] as const,
}

/** One kind-aware list hook (users / referrals / withdraws / logs): the server filters, sorts and pages. */
export const useAffiliateList = <K extends AffiliateListKind>(
  kind: K,
  params?: AffiliateListParams
) =>
  usePaginatedQuery({
    queryKey: affiliateKeys.list(kind, params),
    queryFn: () => affiliateApi.list(kind, params),
  })

export const useAffiliateSettings = () =>
  useQuery({
    queryKey: affiliateKeys.settings(),
    queryFn: affiliateApi.settings,
  })
export const useAffiliateOptions = () =>
  useQuery({ queryKey: affiliateKeys.options(), queryFn: affiliateApi.options })
export const useRegistrationForm = () =>
  useQuery({
    queryKey: affiliateKeys.form(),
    queryFn: affiliateApi.registrationForm,
  })

export const useAffiliateUser = (id?: number | string) =>
  useQuery({
    queryKey: affiliateKeys.user(id ?? ''),
    queryFn: () => affiliateApi.user(id ?? ''),
    enabled: !!id,
  })

export const useAffiliatePayments = (id?: number | string) =>
  useQuery({
    queryKey: affiliateKeys.payments(id ?? ''),
    queryFn: () => affiliateApi.userPayments(id ?? ''),
    enabled: !!id,
  })
