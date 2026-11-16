import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { useCurrencyFormatter } from '@/shared/hooks/useCurrencyFormatter'
import { PERMISSIONS } from '@/shared/permissions'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import { PermissionGuard } from '@/components/guard'
import type { CourierItem } from '../data/courier.type'
import { useCourierMutations } from '../hooks/use-courier-mutations'
import { CourierList } from './courier-list'
import { CourierRowActions } from './courier-row-actions'
import { CourierSettleDialog, type SettleKind } from './courier-settle-dialog'

const h = (key: string) =>
  translatedColumnHeader<CourierItem, unknown>(`courier:columns.${key}`)

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

/** Courier accounts with what they hold and are owed; ban, collect cash and pay out from the row menu. */
export function CourierListPage({ search, navigate }: Props) {
  const { t } = useTranslation('courier')
  const { formatMoney } = useCurrencyFormatter()
  const { setBanned } = useCourierMutations()
  const [banning, setBanning] = useState<CourierItem | null>(null)
  const [settle, setSettle] = useState<{
    courier: CourierItem
    kind: SettleKind
  } | null>(null)
  const columns = useMemo<ColumnDef<CourierItem>[]>(
    () => [
      {
        accessorKey: 'name',
        ...h('name'),
        cell: ({ row }) => (
          <span className='flex items-center gap-2'>
            {row.original.name}
            {row.original.banned && (
              <Badge variant='destructive'>{t('status.banned')}</Badge>
            )}
          </span>
        ),
      },
      { accessorKey: 'email', ...h('email') },
      { accessorKey: 'phone', ...h('phone') },
      {
        accessorKey: 'total_earning',
        ...h('earning'),
        cell: ({ row }) => formatMoney(row.original.total_earning),
      },
      {
        accessorKey: 'total_collection',
        ...h('collection'),
        cell: ({ row }) => formatMoney(row.original.total_collection),
      },
      {
        id: 'actions',
        enableSorting: false,
        enableHiding: false,
        header: () => null,
        cell: ({ row }) => (
          <div className='flex justify-end'>
            <CourierRowActions
              courier={row.original}
              onBan={setBanning}
              onCollect={(courier) => setSettle({ courier, kind: 'collect' })}
              onPay={(courier) => setSettle({ courier, kind: 'pay' })}
            />
          </div>
        ),
      },
    ],
    [t, formatMoney]
  )

  return (
    <CourierList
      kind='couriers'
      columns={columns}
      defaultSort='created_at'
      search={search}
      navigate={navigate}
      actions={
        <PermissionGuard permission={PERMISSIONS.COURIER.CREATE}>
          <Button asChild>
            <Link to='/admin/courier/new'>
              <Plus className='me-2 size-4' />
              {t('actions.add')}
            </Link>
          </Button>
        </PermissionGuard>
      }
    >
      <CourierSettleDialog
        courier={settle?.courier ?? null}
        kind={settle?.kind ?? 'collect'}
        onClose={() => setSettle(null)}
      />
      <ConfirmDialog
        open={!!banning}
        onOpenChange={(open) => !open && setBanning(null)}
        title={t(banning?.banned ? 'ban.unbanTitle' : 'ban.banTitle')}
        desc={t(banning?.banned ? 'ban.unbanDesc' : 'ban.banDesc', {
          name: banning?.name,
        })}
        destructive={!banning?.banned}
        isLoading={setBanned.isPending}
        handleConfirm={() =>
          banning &&
          setBanned.mutate(
            { id: banning.id, banned: !banning.banned },
            { onSuccess: () => setBanning(null) }
          )
        }
      />
    </CourierList>
  )
}
