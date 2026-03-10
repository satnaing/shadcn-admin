import { type Promotion, DiscountType } from '@/types/growth'

export interface AppliedDiscount {
  id: string
  reason: string
  amount: number
  type: 'FIXED' | 'PERCENTAGE'
  appliedAmount: number
  promotionId?: string
  maxDiscountAmount?: number
  scope?: 'CART' | 'PRODUCT'
}

/**
 * Calculates the discount amount based on promotion rules and subtotal.
 * If PERCENTAGE, it applies currentSubtotal * (promo.value / 100).
 * If maxDiscountAmount is present, it caps the discount.
 *
 * If scope is PRODUCT, it applies only to the highest priced item in itemPrices.
 *
 * "House Rules": All percentage discounts are strictly rounded DOWN to the nearest cent
 * using Math.floor(), effectively rounding the Total Payable UP in favor of the merchant.
 */
export function applySmartPromotion(
  promo: Promotion,
  currentSubtotal: number,
  itemPrices: number[] = []
): Omit<AppliedDiscount, 'id'> {
  const value =
    typeof promo.value === 'string' ? parseFloat(promo.value) : promo.value
  let finalDiscountValue = 0

  const isProductScope = promo.scope === 'PRODUCT'
  const baseAmount = isProductScope
    ? Math.max(0, ...itemPrices)
    : currentSubtotal

  if (promo.type === DiscountType.PERCENTAGE) {
    // Round down to the nearest cent (e.g., 2.95 * 0.5 = 1.475 -> 1.47)
    const discountAmount = Math.floor(baseAmount * (value / 100) * 100) / 100
    finalDiscountValue = promo.maxDiscountAmount
      ? Math.min(discountAmount, promo.maxDiscountAmount)
      : discountAmount
  } else {
    // FIXED or FIXED_PRICE (treating as fixed discount)
    finalDiscountValue = Math.min(value, baseAmount)
  }

  return {
    promotionId: promo.id,
    amount: value,
    reason: typeof promo.name === 'string' ? promo.name : promo.name.en,
    type: promo.type === DiscountType.PERCENTAGE ? 'PERCENTAGE' : 'FIXED',
    appliedAmount: finalDiscountValue,
    maxDiscountAmount: promo.maxDiscountAmount,
    scope: (promo.scope as 'CART' | 'PRODUCT') || 'CART',
  }
}
