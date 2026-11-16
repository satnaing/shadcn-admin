import { Link } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/permissions'
import {
  Ban,
  CircleCheck,
  HandCoins,
  MoreHorizontal,
  Pencil,
  Wallet,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { usePermissionStore } from '@/features/auth/data/auth-permission.store'
import type { CourierItem } from '../data/courier.type'

interface Props {
  courier: CourierItem
  onBan: (courier: CourierItem) => void
  onCollect: (courier: CourierItem) => void
  onPay: (courier: CourierItem) => void
}

/** Row menu of the courier list; each entry shows only with its own permission (AEC `@can`). */
export function CourierRowActions({ courier, onBan, onCollect, onPay }: Props) {
  const { t } = useTranslation('courier')
  const can = usePermissionStore((s) => s.hasPermission)
  const P = PERMISSIONS.COURIER

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' aria-label={t('actions.more')}>
          <MoreHorizontal className='size-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {can(P.EDIT) && (
          <DropdownMenuItem asChild>
            <Link to='/admin/courier/$id' params={{ id: String(courier.id) }}>
              <Pencil className='me-2 size-4' />
              {t('actions.edit')}
            </Link>
          </DropdownMenuItem>
        )}
        {can(P.BAN) && (
          <DropdownMenuItem onSelect={() => onBan(courier)}>
            {courier.banned ? (
              <CircleCheck className='me-2 size-4' />
            ) : (
              <Ban className='me-2 size-4' />
            )}
            {t(courier.banned ? 'actions.unban' : 'actions.ban')}
          </DropdownMenuItem>
        )}
        {can(P.COLLECT) && (
          <DropdownMenuItem onSelect={() => onCollect(courier)}>
            <HandCoins className='me-2 size-4' />
            {t('actions.collect')}
          </DropdownMenuItem>
        )}
        {can(P.PAY) && (
          <DropdownMenuItem onSelect={() => onPay(courier)}>
            <Wallet className='me-2 size-4' />
            {t('actions.pay')}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
