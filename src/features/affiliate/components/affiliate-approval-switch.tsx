import { PERMISSIONS } from '@/shared/permissions'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { PermissionGuard } from '@/components/guard'
import type { AffiliateUserItem } from '../data/affiliate.type'
import { useAffiliateMutations } from '../hooks/use-affiliate-mutations'

/** Approval toggle for users who may manage affiliates; a read-only badge for everyone else. */
export function AffiliateApprovalSwitch({ user }: { user: AffiliateUserItem }) {
  const { t } = useTranslation('affiliate')
  const { setApproved } = useAffiliateMutations()

  return (
    <PermissionGuard
      permission={PERMISSIONS.AFFILIATE.USERS_MANAGE}
      fallback={
        <Badge variant={user.is_approved ? 'default' : 'outline'}>
          {t(user.is_approved ? 'status.approved' : 'status.pending')}
        </Badge>
      }
    >
      <Switch
        checked={user.is_approved}
        disabled={setApproved.isPending}
        aria-label={t('columns.approval')}
        onCheckedChange={(approved) =>
          setApproved.mutate({ id: user.id, approved })
        }
      />
    </PermissionGuard>
  )
}
