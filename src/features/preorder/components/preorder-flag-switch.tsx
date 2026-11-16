import { Switch } from '@/components/ui/switch'
import { PermissionGuard } from '@/components/guard'
import { ActiveBadge } from './preorder-badge'

interface Props {
  permission: string
  checked: boolean
  label: string
  onChange: (value: boolean) => void
}

/** Switch for users who may manage the entity; a read-only badge for everyone else. */
export function FlagSwitch({ permission, checked, label, onChange }: Props) {
  return (
    <PermissionGuard
      permission={permission}
      fallback={<ActiveBadge active={checked} />}
    >
      <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
    </PermissionGuard>
  )
}
