import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'

export function isActiveStatus(
  value: boolean | number | null | undefined
): boolean {
  return value === true || value === 1
}

interface StatusProps {
  value?: boolean | number | null | undefined
  active?: boolean
  label?: string
  labelKey?: string
}

export function Status({ value, active, label, labelKey }: StatusProps) {
  const { t } = useTranslation('common')
  const isActive = active ?? isActiveStatus(value)

  const text = labelKey
    ? t(labelKey)
    : (label ?? (isActive ? t('status.enabled') : t('status.disabled')))

  return (
    <Badge variant={isActive ? 'success' : 'danger'} className='capitalize'>
      {text}
    </Badge>
  )
}
