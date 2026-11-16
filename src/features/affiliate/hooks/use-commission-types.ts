import { useTranslation } from 'react-i18next'

/** Select options for a commission: a fixed amount or a percent of the price. */
export function useCommissionTypes() {
  const { t } = useTranslation('affiliate')

  return [
    { value: 'amount', label: t('commissionType.amount') },
    { value: 'percent', label: t('commissionType.percent') },
  ]
}
