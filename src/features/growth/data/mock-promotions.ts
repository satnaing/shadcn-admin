import { DiscountType, type Promotion, PromotionScope } from '@/types/growth'

export const MOCK_PROMOTIONS: Promotion[] = [
  {
    id: 'promo_welcome',
    name: { en: 'Welcome Offer' },
    code: 'WELCOME2025',
    type: DiscountType.PERCENTAGE,
    value: 10,
    scope: PromotionScope.CART,
    description: { en: '10% off for new customers' },
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    budgetLimitAmount: 1000,
    totalAmountBurned: 150,
    status: 'ACTIVE',
  },
  {
    id: 'promo_coffee',
    name: { en: 'Morning Coffee' },
    code: 'COFFEE1',
    type: DiscountType.FIXED,
    value: 1.0,
    scope: PromotionScope.PRODUCT,
    targetSku: 'latte_01',
    description: { en: '$1.00 off Latte' },
    startDate: '2025-02-01',
    endDate: '2025-02-28',
    budgetLimitAmount: 500,
    totalAmountBurned: 45,
    status: 'INACTIVE',
  },
]
