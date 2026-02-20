export const formatCurrency = (
  amount: number,
  currency = 'USD',
  locale = 'en-US',
  options?: Intl.NumberFormatOptions
) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    ...options,
  }).format(amount)
}
