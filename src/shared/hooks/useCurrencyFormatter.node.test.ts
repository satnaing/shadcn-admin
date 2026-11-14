import { QueryClient } from '@tanstack/react-query'
import { describe, expect, it } from 'vitest'
import { currencyKeys, makeMoneyFormatter } from './useCurrencyFormatter'

describe('money formatter follows the default currency', () => {
  const azn = { symbol: '₼', position: 'before', decimal_places: 2 } as const
  const usd = { symbol: '$', position: 'after', decimal_places: 0 } as const

  it('formats per currency and falls back to AZN when none is loaded', () => {
    expect(makeMoneyFormatter(azn).formatMoney(1234.5)).toBe('₼1.234,50')
    expect(makeMoneyFormatter(usd).formatMoney(1234.5)).toBe('1.235 $')
    expect(makeMoneyFormatter(null).formatMoney('x')).toBe('—')
    expect(makeMoneyFormatter(undefined).symbol).toBe('₼')
  })

  it("Settings' `['CURRENCY']` invalidation reaches the formatter query", async () => {
    const client = new QueryClient()
    client.setQueryData(currencyKeys.default, azn)
    expect(client.getQueryState(currencyKeys.default)?.isInvalidated).toBe(false)

    await client.invalidateQueries({ queryKey: ['CURRENCY'], refetchType: 'none' })
    expect(client.getQueryState(currencyKeys.default)?.isInvalidated).toBe(true)
  })
})
