import { z } from 'zod'
import { DiscountType } from '@/types/growth'

export const membershipTierSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.record(z.string(), z.string()), // Localized name: { en: 'Gold', km: 'មាស' }
  discountPercentage: z.number().min(0).max(100),
  priority: z.number().int().default(0).optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).default('DRAFT').optional(),
  slug: z.string().max(50).optional(),
  minSpendRequirement: z.number().min(0),
})

export const loyaltySettingsSchema = z.object({
  minimumSpendPerStamp: z.number().min(0, 'Must be positive'),
  stampsRequiredForReward: z.number().min(0, 'Must be positive'),
  stampCardDurationDays: z.number().min(1, 'Must be at least 1').default(60),
  includeProducts: z.array(z.string()).default([]),
  includeCategories: z.array(z.string()).default([]),
  isActive: z.boolean().default(false),
  type: z.nativeEnum(DiscountType).default(DiscountType.PERCENTAGE),
  value: z.number().min(0, 'Must be positive'),
  membershipTiers: z.array(membershipTierSchema).default([]),
  lastProductSync: z.string().optional(),
})

export const userLoyaltyBalanceSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  email: z.string().email(),
  currentPoints: z.number().int(),
  lifetimePoints: z.number().int(),
})

export const membershipProgramSchema = z.object({
  isActive: z.boolean(),
  membershipTiers: z.array(membershipTierSchema),
  lastProductSync: z.string().optional(),
})

export type MembershipTier = z.infer<typeof membershipTierSchema>
export type LoyaltySettings = z.infer<typeof loyaltySettingsSchema>
export type MembershipProgram = z.infer<typeof membershipProgramSchema>
export type UserLoyaltyBalance = z.infer<typeof userLoyaltyBalanceSchema>
