import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import { Badge } from '@/components/ui/badge'
import type { UsageKind, UsageRow } from '../data/ai.type'

const h = (key: string) => translatedColumnHeader<UsageRow, unknown>(`ai:usage.columns.${key}`)
const num = (key: keyof UsageRow, header: string, sortable = true): ColumnDef<UsageRow> => ({
  accessorKey: key,
  enableSorting: sortable,
  ...h(header),
  cell: ({ row }) => Number(row.original[key] ?? 0).toLocaleString(),
})

export function useAiUsageColumns(kind: UsageKind): ColumnDef<UsageRow>[] {
  // `t` is a dependency on purpose: it changes when the namespace finishes loading, which rebuilds the headers
  const { t, i18n } = useTranslation('ai')

  return useMemo(
    () => [
      {
        accessorKey: 'created_at',
        ...h('date'),
        cell: ({ row }) => new Date(row.original.created_at).toLocaleString(i18n.language),
      },
      { accessorKey: 'user', enableSorting: false, ...h('user'), cell: ({ row }) => row.original.user ?? '—' },
      ...(kind === 'translation'
        ? [{ accessorKey: 'language', enableSorting: false, ...h('language'), cell: ({ row }) => <Badge variant='secondary'>{row.original.language ?? '—'}</Badge> } as ColumnDef<UsageRow>]
        : []),
      { accessorKey: 'model', enableSorting: false, ...h('model'), cell: ({ row }) => <Badge variant='outline'>{row.original.model}</Badge> },
      ...(kind === 'translation' ? [num('translated_count', 'translated')] : []),
      num('prompt_tokens', 'promptTokens'),
      num('completion_tokens', 'completionTokens'),
      num('total_tokens', 'totalTokens'),
    ],
    [kind, i18n.language, t]
  )
}
