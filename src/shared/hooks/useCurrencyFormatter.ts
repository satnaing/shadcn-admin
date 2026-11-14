import { useQuery } from '@tanstack/react-query'
import { requestInstanceClient } from '@/config/api'
/**  feature-ı hələ yoxdur (api 01-settings) — tip yerli saxlanılır. */
interface CurrencyInterface {
  id: number
  code: string
  name: string
  symbol: string
  exchange_rate: number
  is_default: boolean
  is_active: boolean
  decimal_places: number
  position: 'before' | 'after'
}

/** Settings → Currency invalidates the `['CURRENCY']` prefix, so every formatter re-renders. */
export const currencyKeys = { default: ['CURRENCY', 'default'] as const }

type MoneyCurrency = Pick<CurrencyInterface, 'symbol' | 'position' | 'decimal_places'>

export function makeMoneyFormatter(currency: MoneyCurrency | null | undefined) {
  const symbol = currency?.symbol ?? '₼'
  const position = currency?.position ?? 'before'
  const decimals = currency?.decimal_places ?? 2

  const formatMoney = (amount: number | string | null | undefined): string => {
    const n = typeof amount === 'string' ? parseFloat(amount) : (amount ?? 0)
    if (Number.isNaN(n)) return '—'
    const formatted = n.toLocaleString('az-AZ', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
    return position === 'before' ? `${symbol}${formatted}` : `${formatted} ${symbol}`
  }

  return { formatMoney, symbol, position, decimals }
}

/** Fetches currencies once and returns a formatter using the default one. */
export function useCurrencyFormatter() {
  const { data } = useQuery({
    queryKey: currencyKeys.default,
    queryFn: async () => {
      const res = await requestInstanceClient.get<{ data: CurrencyInterface[] }>(
        '/admin/currencies/all'
      )
      const list = (res as { data: CurrencyInterface[] }).data ?? []
      return list.find((c) => c.is_default) ?? list[0] ?? null
    },
    staleTime: 5 * 60 * 1000,
  })

  return makeMoneyFormatter(data)
}
