import { type PaginationMeta } from '@/types/api'
import { type Promotion, DiscountType } from '@/types/growth'
import { apiClient } from '@/lib/api-client'
import type {
  LoyaltySettings,
  MembershipTier,
  UserLoyaltyBalance,
} from '@/features/growth/data/loyalty-schema'

function mapPromotionToSettings(data: Promotion): LoyaltySettings {
  const loyaltyRule =
    data.rules?.find(
      (r: Record<string, unknown>) => r.type === 'LOYALTY_BALANCE'
    ) || {}

  return {
    isActive: data.status === 'ACTIVE',
    type: data.type || DiscountType.PERCENTAGE,
    value: data.value ? Number(data.value) : 100,
    minimumSpendPerStamp:
      ((loyaltyRule as Record<string, unknown>).spend_per_stamp as number) ?? 0,
    stampsRequiredForReward:
      ((loyaltyRule as Record<string, unknown>).stamps_required as number) ?? 0,
    stampCardDurationDays:
      ((loyaltyRule as Record<string, unknown>).card_duration_days as number) ??
      60,
    includeProducts: (
      (data as unknown as { products?: Array<string | { id: string }> })
        .products || []
    )
      .map((p) => (typeof p === 'string' ? p : p?.id))
      .filter((id): id is string => Boolean(id)),
    includeCategories: (
      (data as unknown as { categories?: Array<string | { id: string }> })
        .categories || []
    )
      .map((c) => (typeof c === 'string' ? c : c?.id))
      .filter((id): id is string => Boolean(id)),
    membershipTiers: ((
      data as unknown as { membershipTiers?: MembershipTier[] }
    ).membershipTiers || []) as MembershipTier[],
    lastProductSync: (data as unknown as { lastProductSync?: string })
      .lastProductSync,
  }
}

function mapSettingsToPromotionUpdate(
  settings: LoyaltySettings
): Record<string, unknown> {
  return {
    status: settings.isActive ? 'ACTIVE' : 'INACTIVE',
    type: settings.type,
    value: settings.value,
    rules: [
      {
        type: 'LOYALTY_BALANCE',
        spend_per_stamp: settings.minimumSpendPerStamp,
        stamps_required: settings.stampsRequiredForReward,
        stamp_multiplier: 1,
        card_duration_days: settings.stampCardDurationDays,
      } as Record<string, unknown>,
    ],
    includeProducts: settings.includeProducts,
    includeCategories: settings.includeCategories,
    membershipTiers: settings.membershipTiers,
  }
}

export const getLoyaltySettings = async (): Promise<LoyaltySettings> => {
  const response = await apiClient.get('/admin/loyalty-program')
  return mapPromotionToSettings(response.data)
}

export const updateLoyaltySettings = async (
  data: LoyaltySettings
): Promise<LoyaltySettings> => {
  const payload = mapSettingsToPromotionUpdate(data)
  const response = await apiClient.patch('/admin/loyalty-program', payload)
  return mapPromotionToSettings(response.data)
}

export const getCustomerBalances = async (
  params?: Record<string, unknown>
): Promise<{ data: UserLoyaltyBalance[]; meta: PaginationMeta }> => {
  const response = await apiClient.get('/admin/loyalty-program/balances', {
    params,
  })
  return {
    data: response.data?.items ?? [],
    meta: {
      totalItems: response.data?.meta?.totalItems ?? 0,
      itemCount: response.data?.meta?.itemCount ?? 0,
      itemsPerPage: response.data?.meta?.itemsPerPage ?? 10,
      totalPages: response.data?.meta?.totalPages ?? 1,
      currentPage: response.data?.meta?.currentPage ?? 1,
    },
  }
}
