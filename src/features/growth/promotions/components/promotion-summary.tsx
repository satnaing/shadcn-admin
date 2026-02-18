import { format } from 'date-fns'
import { useFormContext } from 'react-hook-form'
import { Sparkles } from 'lucide-react'
import { type PromotionViewModel } from '../types'

export function PromotionSummary() {
  const { watch } = useFormContext<PromotionViewModel>()

  // Watch entire form to ensure re-render on ANY change (including in-place tier edits)
  const formValues = watch()

  const mode = formValues.mode
  const discountType = formValues.discountType
  const discountValue = formValues.discountValue
  const targets = formValues.targets
  const minQuantity = formValues.minQuantity
  const minSubtotal = formValues.minSubtotal
  const startDate = formValues.startDate
  const endDate = formValues.endDate
  const usageLimitType = formValues.usageLimitType
  const usageLimitValue = formValues.usageLimitValue

  // These only exist on certain mode variants — cast through unknown
  const _any = formValues as unknown as Record<string, unknown>
  const rewardMode = _any.rewardMode as string | undefined
  const rewardTargets = _any.rewardTargets as
    | { name: string; id: string }[]
    | undefined
  const tiers = _any.tiers as { threshold: number; value: number }[] | undefined

  // Helper: Pluralization & Naming
  const formatItemNames = (items?: { name: string }[]) => {
    if (!items || items.length === 0) return '[Items]'
    if (items.length === 1) return items[0].name
    return `${items[0].name} + ${items.length - 1} more`
  }

  const formatBold = (text: string | number) =>
    `<span class="font-bold text-foreground">${text}</span>`

  // ── 1. Dates (Constraints) ──
  let datePart = ''
  if (startDate && endDate) {
    try {
      datePart = `Valid ${format(
        new Date(startDate),
        'MMM d, yyyy'
      )} — ${format(new Date(endDate), 'MMM d, yyyy')}`
    } catch {
      // Ignore invalid dates
    }
  } else if (startDate) {
    try {
      datePart = `Starts ${format(new Date(startDate), 'MMM d, yyyy')}`
    } catch {
      // Ignore
    }
  }

  // ── 2. Logic (Mode specific) ──
  let logicPart = 'Configure your promotion...'
  const targetLabel = formatItemNames(targets)

  if (mode === 'ITEM_MARKDOWN') {
    const discount =
      discountType === 'PERCENTAGE' ? `${discountValue}%` : `$${discountValue}`
    logicPart = `${formatBold(targetLabel)} will be ${formatBold(
      discount + ' off'
    )}.`
  } else if (mode === 'VOLUME_INCENTIVE') {
    if (rewardMode === 'UNLOCK') {
      const rewardLabel = formatItemNames(rewardTargets)
      const price = discountValue ? `$${discountValue}` : 'special price'
      logicPart = `Buy ${formatBold(minQuantity ?? 0)} ${targetLabel} to unlock ${formatBold(
        rewardLabel
      )} for ${formatBold(price)}.`
    } else if (rewardMode === 'BUNDLE') {
      logicPart = `Buy ${formatBold(minQuantity ?? 0)} ${targetLabel} for a bundle price of ${formatBold(
        '$' + discountValue
      )}.`
    } else {
      const discount =
        discountType === 'PERCENTAGE'
          ? `${discountValue}%`
          : `$${discountValue}`
      logicPart = `Buy ${formatBold(minQuantity ?? 0)} ${targetLabel} to get ${formatBold(
        discount + ' off'
      )}.`
    }
  } else if (mode === 'CART_REWARD') {
    const sortedTiers = [...(tiers || [])].sort(
      (a, b) => a.threshold - b.threshold
    )

    if (rewardMode === 'UNLOCK') {
      const rewardLabel = formatItemNames(rewardTargets)
      const price = discountValue ? `$${discountValue}` : 'special price'
      logicPart = `Spend ${formatBold('$' + minSubtotal)} to unlock ${formatBold(
        rewardLabel
      )} for ${formatBold(price)}.`
    } else if (sortedTiers.length > 0) {
      const firstTier = sortedTiers[0]
      const lastTier = sortedTiers[sortedTiers.length - 1]

      const formatReward = (val: number) =>
        discountType === 'PERCENTAGE' ? `${val}% off` : `$${val} off`

      if (sortedTiers.length === 1) {
        logicPart = `Spend ${formatBold('$' + firstTier.threshold)} to get ${formatBold(formatReward(firstTier.value))}.`
      } else {
        logicPart = `Spend ${formatBold('$' + firstTier.threshold)} for ${formatBold(formatReward(firstTier.value))}, or up to ${formatBold('$' + lastTier.threshold)} for ${formatBold(formatReward(lastTier.value))}.`
      }
    } else {
      logicPart = `Spend ${formatBold('$' + minSubtotal)} to get ${formatBold(
        '$' + discountValue + ' off'
      )} your order.`
    }
  }

  // ── 3. Limits ──
  let limitPart = ''
  if (usageLimitType && usageLimitType !== 'none' && usageLimitValue) {
    const typeLabel = usageLimitType === 'ACCOUNT' ? 'Account' : 'Order'
    limitPart = `Limit: ${usageLimitValue} per ${typeLabel}`
  }

  // ── 4. Compose ──
  const deal = logicPart
  const constraints = [datePart, limitPart].filter(Boolean).join(' • ')

  if (!deal) return null

  return (
    <div className='flex items-start gap-4 rounded-lg border-l-4 border-[#800000] bg-muted/20 p-4 shadow-sm'>
      <div className='mt-1 shrink-0'>
        <Sparkles className='h-5 w-5 fill-[#800000] text-[#800000]' />
      </div>
      <div className='flex flex-col gap-1.5'>
        <div
          className='text-lg leading-tight text-foreground/90'
          dangerouslySetInnerHTML={{ __html: deal }}
        />
        {constraints && (
          <div className='text-sm font-medium text-slate-500'>
            {constraints}
          </div>
        )}
      </div>
    </div>
  )
}
