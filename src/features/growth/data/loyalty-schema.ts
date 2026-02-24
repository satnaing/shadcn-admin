import { z } from 'zod'
import { DiscountType } from '@/types/growth'

export const loyaltySettingsSchema = z.object({
  minimumSpendPerStamp: z.number().min(0, 'Must be positive'),
  stampsRequiredForReward: z.number().min(0, 'Must be positive'),
  stampCardDurationDays: z.number().min(1, 'Must be at least 1').default(60),
  includeProducts: z.array(z.string()).default([]),
  includeCategories: z.array(z.string()).default([]),
  isActive: z.boolean().default(false),
  type: z.nativeEnum(DiscountType).default(DiscountType.PERCENTAGE),
  value: z.number().min(0, 'Must be positive'),
})

export const userLoyaltyBalanceSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  email: z.string().email(),
  currentPoints: z.number().int(),
  lifetimePoints: z.number().int(),
})

export type LoyaltySettings = z.infer<typeof loyaltySettingsSchema>
export type UserLoyaltyBalance = z.infer<typeof userLoyaltyBalanceSchema>
