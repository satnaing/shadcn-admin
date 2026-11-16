import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Pencil } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import { PermissionGuard } from '@/components/guard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { PERMISSIONS } from '@/shared/permissions'
import type { TemplateItem } from '../data/otp.type'

const h = (key: string) => translatedColumnHeader<TemplateItem, unknown>(`otp:templates.columns.${key}`)

export function useOtpTemplateColumns(
  onToggle: (item: TemplateItem) => void,
  onEdit: (item: TemplateItem) => void
): ColumnDef<TemplateItem>[] {
  const { t } = useTranslation('otp')

  return useMemo(
    () => [
      {
        accessorKey: 'identifier',
        ...h('name'),
        cell: ({ row }) => t(`templates.names.${row.original.identifier}`),
      },
      {
        accessorKey: 'body',
        enableSorting: false,
        ...h('body'),
        cell: ({ row }) => <span className='line-clamp-2 max-w-md text-muted-foreground'>{row.original.body}</span>,
      },
      { accessorKey: 'template_id', enableSorting: false, ...h('templateId'), cell: ({ row }) => row.original.template_id ?? '—' },
      {
        accessorKey: 'active',
        ...h('status'),
        cell: ({ row }) =>
          row.original.required ? (
            <Badge variant='secondary'>{t('templates.alwaysOn')}</Badge>
          ) : (
            <PermissionGuard
              permission={PERMISSIONS.OTP.TEMPLATES_MANAGE}
              fallback={<Badge variant={row.original.active ? 'secondary' : 'outline'}>{t(row.original.active ? 'common.on' : 'common.off')}</Badge>}
            >
              <Switch
                checked={row.original.active}
                onCheckedChange={() => onToggle(row.original)}
                aria-label={t(`templates.names.${row.original.identifier}`)}
              />
            </PermissionGuard>
          ),
      },
      {
        id: 'actions',
        enableSorting: false,
        enableHiding: false,
        header: () => null,
        cell: ({ row }) => (
          <PermissionGuard permission={PERMISSIONS.OTP.TEMPLATES_MANAGE}>
            <Button size='icon' variant='ghost' aria-label={t('actions.edit')} onClick={() => onEdit(row.original)}>
              <Pencil className='size-4' />
            </Button>
          </PermissionGuard>
        ),
      },
    ],
    [t, onToggle, onEdit]
  )
}
