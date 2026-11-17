import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { PermissionGuard } from '@/components/guard'

interface Props {
  permission: string
  checked: boolean
  label: string
  onChange: (value: boolean) => void
}

/** Switch for users who may edit products; a read-only badge for everyone else. */
export function WholesaleFlagSwitch({
  permission,
  checked,
  label,
  onChange,
}: Props) {
  const { t } = useTranslation('wholesale')

  return (
    <PermissionGuard
      permission={permission}
      fallback={
        <Badge variant={checked ? 'default' : 'secondary'}>
          {t(checked ? 'state.on' : 'state.off')}
        </Badge>
      }
    >
      <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
    </PermissionGuard>
  )
}
