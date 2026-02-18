import { DiscountType, PromotionScope } from '@/types/growth'
import type {
  CreatePromotionDto,
  PromotionAction,
  PromotionViewModel,
  SearchResultItem,
} from '../types'

export const mapFormToDto = (state: PromotionViewModel): CreatePromotionDto => {
  // Common fields
  const base: Partial<CreatePromotionDto> = {
    name: { en: state.name },
    description: state.description ? { en: state.description } : undefined,
    type: state.discountType || DiscountType.PERCENTAGE,
    value: state.discountValue ?? 0,
    scope: PromotionScope.CART,
    budgetLimitAmount: state.budgetLimitAmount,
    startDate: state.startDate,
    endDate: state.endDate,
    code: state.code || undefined,
    isFeatured: state.isFeatured || false,
    bannerUrl: state.bannerUrl,

    // Strategy Type
    strategyType: state.isStackable === false ? 'BEST_DEAL' : 'STACKABLE',

    // Activation system
    applicationType: state.applicationType || 'AUTOMATIC',
    isVoucherRequired:
      state.applicationType === 'HIDDEN'
        ? state.isVoucherRequired || false
        : false,

    rewardProductId: undefined,

    rules: [],
    actions: [],
  }

  // --- Helper: resolve action type from DiscountType ---
  const resolveActionType = (dt?: DiscountType): PromotionAction['type'] => {
    switch (dt) {
      case DiscountType.PERCENTAGE:
        return 'DISCOUNT_PERCENTAGE'
      case DiscountType.FIXED:
        return 'DISCOUNT_FIXED'
      case DiscountType.FIXED_PRICE:
        return 'SET_FIXED_PRICE'
      default:
        return 'DISCOUNT_PERCENTAGE'
    }
  }

  // --- Helper: collect target IDs ---
  const extractIds = (items: SearchResultItem[] | undefined, type: string) => {
    if (!items) return []
    return items.filter((i) => i.type === type).map((i) => i.id)
  }

  const collectTargets = (
    targets: SearchResultItem[] = [],
    excludedTargets: SearchResultItem[] = []
  ) => {
    const includeProducts = extractIds(targets, 'PRODUCT')
    const includeCategories = extractIds(targets, 'CATEGORY')
    const includeCollections = extractIds(targets, 'COLLECTION')

    const excludeProducts = extractIds(excludedTargets, 'PRODUCT')
    const excludeCategories = extractIds(excludedTargets, 'CATEGORY')
    const excludeCollections = extractIds(excludedTargets, 'COLLECTION')

    const hasCollections =
      includeCollections.length > 0 || excludeCollections.length > 0
    const hasExclusions = excludedTargets.length > 0
    const hasMixedInclusions =
      includeProducts.length > 0 && includeCategories.length > 0

    // Determine Scope
    let scope = PromotionScope.PRODUCT // Default

    if (hasCollections || hasExclusions || hasMixedInclusions) {
      scope = PromotionScope.MIXED
    } else if (includeCategories.length > 0 && includeProducts.length === 0) {
      scope = PromotionScope.CATEGORY
    } else if (includeProducts.length > 0) {
      scope = PromotionScope.PRODUCT
    }

    // For backwards compatibility and rule setting
    const allIncludeIds = [
      ...includeProducts,
      ...includeCategories,
      ...includeCollections,
    ]

    return {
      scope,
      includeProducts,
      includeCategories,
      includeCollections,
      excludeProducts,
      excludeCategories,
      excludeCollections,
      allIncludeIds,
    }
  }

  switch (state.mode) {
    // ─────────────────────────────────────────────
    // MODE 1: Item Markdown (Simple Sale OR Category PWP)
    // ─────────────────────────────────────────────
    case 'ITEM_MARKDOWN': {
      if (state.targetScope === 'ALL') {
        // ALL scope: no includes, only optional exclusions
        const excludeProducts = extractIds(state.excludedTargets, 'PRODUCT')
        const excludeCategories = extractIds(state.excludedTargets, 'CATEGORY')
        const excludeCollections = extractIds(
          state.excludedTargets,
          'COLLECTION'
        )
        const hasExclusions =
          excludeProducts.length > 0 ||
          excludeCategories.length > 0 ||
          excludeCollections.length > 0

        base.scope = hasExclusions ? PromotionScope.MIXED : PromotionScope.CART

        if (excludeProducts.length > 0) base.excludeProducts = excludeProducts
        if (excludeCategories.length > 0)
          base.excludeCategories = excludeCategories
        if (excludeCollections.length > 0)
          base.excludeCollections = excludeCollections

        // Rule: ITEM_QTY >= 1 (no targetIds = all items)
        base.rules!.push({
          type: 'ITEM_QTY',
          operator: 'GTE',
          value: 1,
          excludeDirty: state.excludeDirty,
        })

        if (state.rewardMode === 'UNLOCK') {
          const rewardIds = state.rewardTargets?.map((t) => t.id) || []
          if (rewardIds.length > 0) {
            base.rewardProductId = rewardIds[0]
            base.rules!.push({
              type: 'HAS_PRODUCT',
              value: 1,
              targetIds: rewardIds,
            })
          }
          base.type = DiscountType.FIXED_PRICE
          base.actions!.push({
            type: 'SET_FIXED_PRICE',
            value: state.discountValue,
            targetIds: rewardIds,
            maxQty: state.rewardQuantity ?? 1,
          })
        } else {
          base.actions!.push({
            type: resolveActionType(state.discountType),
            value: state.discountValue,
          })
        }
      } else {
        // SPECIFIC scope: current behavior
        const {
          scope,
          includeProducts,
          includeCategories,
          includeCollections,
          excludeProducts,
          excludeCategories,
          excludeCollections,
          allIncludeIds,
        } = collectTargets(state.targets, state.excludedTargets)

        base.scope = scope

        if (includeProducts.length > 0) base.includeProducts = includeProducts
        if (includeCategories.length > 0)
          base.includeCategories = includeCategories
        if (includeCollections.length > 0)
          base.includeCollections = includeCollections

        if (excludeProducts.length > 0) base.excludeProducts = excludeProducts
        if (excludeCategories.length > 0)
          base.excludeCategories = excludeCategories
        if (excludeCollections.length > 0)
          base.excludeCollections = excludeCollections

        base.rules!.push({
          type: 'ITEM_QTY',
          operator: 'GTE',
          value: 1,
          targetIds: allIncludeIds.length > 0 ? allIncludeIds : undefined,
          excludeDirty: state.excludeDirty,
        })

        if (state.rewardMode === 'UNLOCK') {
          const rewardIds = state.rewardTargets?.map((t) => t.id) || []
          if (rewardIds.length > 0) {
            base.rewardProductId = rewardIds[0]
            base.rules!.push({
              type: 'HAS_PRODUCT',
              value: 1,
              targetIds: rewardIds,
            })
          }
          base.type = DiscountType.FIXED_PRICE
          base.actions!.push({
            type: 'SET_FIXED_PRICE',
            value: state.discountValue,
            targetIds: rewardIds,
            maxQty: state.rewardQuantity ?? 1,
          })
        } else {
          base.actions!.push({
            type: resolveActionType(state.discountType),
            value: state.discountValue,
            targetIds: allIncludeIds.length > 0 ? allIncludeIds : undefined,
          })
        }
      }
      break
    }

    // ─────────────────────────────────────────────
    // MODE 2: Volume Incentive (BOGO / Bulk)
    // ─────────────────────────────────────────────
    case 'VOLUME_INCENTIVE': {
      if (state.targetScope === 'ALL') {
        // ALL scope: no includes, only optional exclusions
        const excludeProducts = extractIds(state.excludedTargets, 'PRODUCT')
        const excludeCategories = extractIds(state.excludedTargets, 'CATEGORY')
        const excludeCollections = extractIds(
          state.excludedTargets,
          'COLLECTION'
        )
        const hasExclusions =
          excludeProducts.length > 0 ||
          excludeCategories.length > 0 ||
          excludeCollections.length > 0

        base.scope = hasExclusions ? PromotionScope.MIXED : PromotionScope.CART

        if (excludeProducts.length > 0) base.excludeProducts = excludeProducts
        if (excludeCategories.length > 0)
          base.excludeCategories = excludeCategories
        if (excludeCollections.length > 0)
          base.excludeCollections = excludeCollections

        base.rules!.push({
          type: 'ITEM_QTY',
          operator: 'GTE',
          value: state.minQuantity,
          excludeDirty: state.excludeDirty,
        })

        if (state.rewardMode === 'UNLOCK') {
          const rewardIds = state.rewardTargets?.map((t) => t.id) || []
          if (rewardIds.length > 0) {
            base.rewardProductId = rewardIds[0]
            base.rules!.push({
              type: 'HAS_PRODUCT',
              value: 1,
              targetIds: rewardIds,
            })
          }
          base.type = DiscountType.FIXED_PRICE
          base.actions!.push({
            type: 'SET_FIXED_PRICE',
            value: state.discountValue,
            targetIds: rewardIds,
            maxQty: state.rewardQuantity ?? 1,
          })
        } else if (state.rewardMode === 'BUNDLE') {
          base.type = DiscountType.FIXED_PRICE
          base.actions!.push({
            type: 'SET_FIXED_PRICE',
            value: state.discountValue,
          })
        } else {
          base.actions!.push({
            type: resolveActionType(state.discountType),
            value: state.discountValue,
            maxQty: state.rewardQuantity,
          })
        }
      } else {
        // SPECIFIC scope: current behavior
        const {
          scope,
          allIncludeIds,
          includeProducts,
          includeCategories,
          includeCollections,
          excludeProducts,
          excludeCategories,
          excludeCollections,
        } = collectTargets(state.targets, state.excludedTargets)

        base.scope = scope
        if (includeProducts.length > 0) base.includeProducts = includeProducts
        if (includeCategories.length > 0)
          base.includeCategories = includeCategories
        if (includeCollections.length > 0)
          base.includeCollections = includeCollections

        if (excludeProducts.length > 0) base.excludeProducts = excludeProducts
        if (excludeCategories.length > 0)
          base.excludeCategories = excludeCategories
        if (excludeCollections.length > 0)
          base.excludeCollections = excludeCollections

        base.rules!.push({
          type: 'ITEM_QTY',
          operator: 'GTE',
          value: state.minQuantity,
          targetIds: allIncludeIds.length > 0 ? allIncludeIds : undefined,
          excludeDirty: state.excludeDirty,
        })

        if (state.rewardMode === 'UNLOCK') {
          const rewardIds = state.rewardTargets?.map((t) => t.id) || []
          if (rewardIds.length > 0) {
            base.rewardProductId = rewardIds[0]
            base.rules!.push({
              type: 'HAS_PRODUCT',
              value: 1,
              targetIds: rewardIds,
            })
          }
          base.type = DiscountType.FIXED_PRICE
          base.actions!.push({
            type: 'SET_FIXED_PRICE',
            value: state.discountValue,
            targetIds: rewardIds,
            maxQty: state.rewardQuantity ?? 1,
          })
        } else if (state.rewardMode === 'BUNDLE') {
          base.type = DiscountType.FIXED_PRICE
          base.actions!.push({
            type: 'SET_FIXED_PRICE',
            value: state.discountValue,
            targetIds: allIncludeIds.length > 0 ? allIncludeIds : undefined,
          })
        } else {
          base.actions!.push({
            type: resolveActionType(state.discountType),
            value: state.discountValue,
            targetIds: allIncludeIds.length > 0 ? allIncludeIds : undefined,
            maxQty: state.rewardQuantity,
          })
        }
      }
      break
    }

    // ─────────────────────────────────────────────
    // MODE 3: Cart Reward
    // ─────────────────────────────────────────────
    case 'CART_REWARD': {
      let ruleTargets: string[] | undefined

      if (state.targetScope === 'SPECIFIC') {
        const {
          scope,
          allIncludeIds,
          includeProducts,
          includeCategories,
          includeCollections,
          excludeProducts,
          excludeCategories,
          excludeCollections,
        } = collectTargets(state.targets, state.excludedTargets)

        base.scope = scope
        if (includeProducts.length > 0) base.includeProducts = includeProducts
        if (includeCategories.length > 0)
          base.includeCategories = includeCategories
        if (includeCollections.length > 0)
          base.includeCollections = includeCollections

        if (excludeProducts.length > 0) base.excludeProducts = excludeProducts
        if (excludeCategories.length > 0)
          base.excludeCategories = excludeCategories
        if (excludeCollections.length > 0)
          base.excludeCollections = excludeCollections

        // Pass targets to rule
        ruleTargets = allIncludeIds.length > 0 ? allIncludeIds : undefined
      } else {
        base.scope = PromotionScope.CART
      }

      const excludeDirty = state.excludeDirty

      if (state.minMemberCount && state.minMemberCount > 1) {
        base.rules!.push({
          type: 'MEMBER_COUNT',
          operator: 'GTE',
          value: state.minMemberCount,
        })
      }

      if (state.rewardMode === 'UNLOCK') {
        base.rules!.push({
          type: 'CART_SUBTOTAL',
          operator: 'GTE',
          value: state.minSubtotal,
          excludeDirty,
          targetIds: ruleTargets,
        })
        const rewardIds = state.rewardTargets?.map((t) => t.id) || []
        if (rewardIds.length > 0) {
          base.rewardProductId = rewardIds[0]
        }
        base.type = DiscountType.FIXED_PRICE
        base.actions!.push({
          type: 'SET_FIXED_PRICE',
          value: state.discountValue,
          targetIds: rewardIds,
          maxQty: state.rewardQuantity ?? 1,
        })
      } else if (state.tiers && state.tiers.length > 0) {
        const sortedTiers = [...state.tiers].sort(
          (a, b) => a.threshold - b.threshold
        )
        base.strategyType = 'BEST_DEAL'
        const tierActionType = resolveActionType(state.discountType)
        base.rules!.push({
          type: 'TIERED_SUBTOTAL',
          operator: 'GTE',
          value: 0,
          excludeDirty,
          tiers: sortedTiers.map((t) => ({
            threshold: t.threshold,
            rewardValue: t.value,
            rewardType: tierActionType,
          })),
          targetIds: ruleTargets,
        })
        const baseTier = sortedTiers[0]
        base.actions!.push({
          type: tierActionType,
          value: baseTier.value,
        })
      } else {
        base.rules!.push({
          type: 'CART_SUBTOTAL',
          operator: 'GTE',
          value: state.minSubtotal,
          excludeDirty,
          targetIds: ruleTargets,
        })
        base.actions!.push({
          type: resolveActionType(state.discountType),
          value: state.discountValue,
        })
      }
      break
    }
  }

  return base as CreatePromotionDto
}

export const mapDtoToForm = (dto: any): PromotionViewModel => {
  // Safe defaults
  const base: any = {
    name: dto.name?.en || '',
    description: dto.description?.en || '',
    code: dto.code || '',
    startDate: dto.startDate,
    endDate: dto.endDate,
    budgetLimitAmount: dto.budgetLimitAmount,
    excludeDirty: true, // Default
    priority: dto.priority || 0,
    isFeatured: dto.isFeatured || false,
    bannerUrl: dto.bannerUrl,
    isStackable: dto.strategyType === 'STACKABLE',
    applicationType: dto.applicationType || 'AUTOMATIC',
    isVoucherRequired: dto.isVoucherRequired || false,
    discountType: dto.type,
    discountValue: parseFloat(dto.value || '0'),
  }

  const rules = dto.rules || []
  const actions = dto.actions || []
  const firstAction = actions[0] || {}

  // 1. Determine Mode & Scope from Rules
  const itemQtyRule = rules.find((r: any) => r.type === 'ITEM_QTY')
  const cartRule = rules.find((r: any) => r.type === 'CART_SUBTOTAL')
  const tieredRule = rules.find((r: any) => r.type === 'TIERED_SUBTOTAL')
  const memberRule = rules.find((r: any) => r.type === 'MEMBER_COUNT')

  // Helper to reconstruct targets
  // This is tricky without the full product objects.
  // We might need to fetch them, but for now we'll create skeleton items
  // referencing the IDs so the picker *might* be able to load them or at least show IDs.
  //Ideally the UI picker can handle "pre-selected IDs" even without full object, or we fetch.
  // For this implementation, we will map to basic objects.
  const mapTargets = (ids?: string[]) =>
    (ids || []).map((id) => ({
      id,
      type: 'PRODUCT',
      name: 'Loading...',
    })) as SearchResultItem[]

  // --- CART REWARD ---
  if (cartRule || tieredRule) {
    base.mode = 'CART_REWARD'
    base.targetScope = 'ALL'

    if (tieredRule) {
      base.minSubtotal = 0
      base.tiers = (tieredRule.tiers || []).map((t: any) => ({
        threshold: t.threshold,
        value: t.rewardValue,
      }))
      // Infer discount type from first tier
      if (tieredRule.tiers?.[0]?.rewardType === 'DISCOUNT_FIXED') {
        base.discountType = DiscountType.FIXED
      } else {
        base.discountType = DiscountType.PERCENTAGE
      }

      // Reverse Map Targeting from Tiered Rule
      if (tieredRule.targetIds?.length > 0) {
        base.targetScope = 'SPECIFIC'
        base.targets = mapTargets(tieredRule.targetIds)
      }
    } else {
      base.minSubtotal = cartRule.value
      base.discountType =
        firstAction.type === 'DISCOUNT_FIXED'
          ? DiscountType.FIXED
          : DiscountType.PERCENTAGE
      base.discountValue = firstAction.value

      // Reverse Map Targeting from Cart Rule
      if (cartRule.targetIds?.length > 0) {
        base.targetScope = 'SPECIFIC'
        base.targets = mapTargets(cartRule.targetIds)
      }
    }

    if (memberRule) {
      base.minMemberCount = memberRule.value
    }

    // PWP Check for Cart
    if (
      firstAction.type === 'SET_FIXED_PRICE' ||
      firstAction.type === 'UNLOCK_PRODUCT'
    ) {
      base.rewardMode = 'UNLOCK'
      base.discountType = DiscountType.FIXED_PRICE
      base.rewardTargets = mapTargets(firstAction.targetIds)
      base.rewardQuantity = firstAction.maxQty
      base.discountValue = firstAction.value
    }

    return base as PromotionViewModel
  }

  // --- VOLUME INCENTIVE ---
  if (itemQtyRule && itemQtyRule.value > 1) {
    base.mode = 'VOLUME_INCENTIVE'
    base.minQuantity = itemQtyRule.value
    base.targets = mapTargets(itemQtyRule.targetIds)
    base.targetScope = itemQtyRule.targetIds?.length ? 'SPECIFIC' : 'ALL'
    // Exclusions would need to be in rules or inferred from a specific exclusion rule type if it existed
    // For now assuming exclusions are part of the targetIds logic or not fully reversible without extra data

    // Check for Bundle/PWP
    if (firstAction.type === 'SET_FIXED_PRICE') {
      if (firstAction.targetIds?.length) {
        // Different targets than trigger -> UNLOCK
        // Same targets -> BUNDLE (Fixed Price)
        const triggerIds = itemQtyRule.targetIds || []
        const actionIds = firstAction.targetIds || []
        const isSame =
          triggerIds.length === actionIds.length &&
          triggerIds.every((id: string) => actionIds.includes(id))

        if (isSame) {
          base.rewardMode = 'BUNDLE'
          base.discountType = DiscountType.FIXED_PRICE
        } else {
          base.rewardMode = 'UNLOCK'
          base.rewardTargets = mapTargets(actionIds)
          base.rewardQuantity = firstAction.maxQty
        }
      } else {
        base.rewardMode = 'BUNDLE'
      }
    } else {
      base.rewardQuantity = firstAction.maxQty
    }

    return base as PromotionViewModel
  }

  // --- ITEM MARKDOWN (Default fallback) ---
  base.mode = 'ITEM_MARKDOWN'
  base.targetScope = itemQtyRule?.targetIds?.length ? 'SPECIFIC' : 'ALL'
  base.targets = mapTargets(itemQtyRule?.targetIds)

  if (firstAction.type === 'SET_FIXED_PRICE' && firstAction.targetIds?.length) {
    base.rewardMode = 'UNLOCK'
    base.rewardTargets = mapTargets(firstAction.targetIds)
    base.rewardQuantity = firstAction.maxQty
    base.discountType = DiscountType.FIXED_PRICE
  }

  return base as PromotionViewModel
}
