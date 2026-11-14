import type { ColumnDef } from '@tanstack/react-table'
import { Home } from 'lucide-react'
import type { TFunction } from 'i18next'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import { FALLBACK_FORM_LOCALES } from '@/shared/constants/locales'
import type { PageRow } from '../data/pages.type'
import { PageRowActions, type PageRowHandlers } from './page-row-actions'

export const STATUS_FILTER_ID = 'status_label'
export const LANG_FILTER_ID = 'lang'

export function createPageColumns(t: TFunction, handlers: PageRowHandlers): ColumnDef<PageRow>[] {
  return [
    {
      accessorKey: 'title',
      header: ({ column }) => <DataTableColumnHeader column={column} titleKey='pages:columns.title' />,
      cell: ({ row }) => (
        <button
          type='button'
          className='flex items-center gap-2 text-start font-medium hover:underline'
          onClick={() => handlers.onBuilder(row.original)}
        >
          {row.original.title}
          {row.original.is_homepage ? (
            <Badge variant='secondary' className='gap-1'>
              <Home className='size-3' />
              {t('homepage')}
            </Badge>
          ) : null}
        </button>
      ),
    },
    { accessorKey: 'slug', header: t('columns.slug'), cell: ({ row }) => `/${row.original.slug}`, enableSorting: false },
    {
      id: 'translations',
      header: t('columns.languages'),
      enableSorting: false,
      cell: ({ row }) => (
        <div className='flex gap-1'>
          {FALLBACK_FORM_LOCALES.map((code) => (
            <Badge key={code} variant={row.original.translations.includes(code) ? 'default' : 'outline'} className='uppercase'>
              {code}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      id: 'status',
      header: t('columns.status'),
      enableSorting: false,
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'published' ? 'default' : 'secondary'}>
          {t(`status.${row.original.status}`)}
        </Badge>
      ),
    },
    { accessorKey: 'sections_count', header: t('columns.sections'), enableSorting: false },
    {
      accessorKey: 'updated_at',
      header: ({ column }) => <DataTableColumnHeader column={column} titleKey='pages:columns.updated' />,
      cell: ({ row }) => new Date(row.original.updated_at).toLocaleDateString(),
    },
    { id: 'actions', cell: ({ row }) => <PageRowActions page={row.original} handlers={handlers} /> },
    { id: STATUS_FILTER_ID, accessorKey: 'status', enableSorting: false },
    { id: LANG_FILTER_ID, accessorKey: 'translations', enableSorting: false },
  ]
}
