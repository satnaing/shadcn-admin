import { useTranslation } from 'react-i18next'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { EntityDataTable } from '@/components/data-table'
import { DateRangeFilter } from '@/components/data-table/date-range-filter'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { toServerListParams } from '@/shared/utils/list-query-string'
import type { UsageKind } from '../data/ai.type'
import { useAiUsage } from '../hooks/use-ai'
import { AiUsageStats } from './ai-usage-stats'
import { useAiUsageColumns } from './ai-usage-columns'

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

const KINDS: UsageKind[] = ['content', 'translation']
const asDay = (v: unknown) => (typeof v === 'string' ? v : undefined)

/** AEC "Token Usage" (content AI) and the addon's "AI Translation Token Usage" in one screen: `?kind=`, `?from=&to=`. */
export function AiUsagePage({ search, navigate }: Props) {
  const { t } = useTranslation('ai')
  const kind: UsageKind = search.kind === 'translation' ? 'translation' : 'content'
  const columns = useAiUsageColumns(kind)
  const params = { ...toServerListParams(search, { defaultSort: 'created_at' }), kind, from: asDay(search.from), to: asDay(search.to) }
  const { data } = useAiUsage(params)

  return (
    <AdminPageShell title={t('usage.title')} description={t('usage.description')}>
      <Tabs value={kind} onValueChange={(v) => navigate({ search: (prev) => ({ ...prev, kind: v === 'content' ? undefined : v, page: undefined, sort: undefined }) })}>
        <TabsList>
          {KINDS.map((k) => (
            <TabsTrigger key={k} value={k}>
              {t(`usage.kinds.${k}`)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <DateRangeFilter search={search} navigate={navigate} labels={{ from: t('usage.from'), to: t('usage.to') }} />
      <AiUsageStats kind={kind} stats={data?.stats} />
      <EntityDataTable
        key={kind}
        data={data?.data ?? []}
        meta={data?.meta}
        search={search}
        navigate={navigate}
        columns={columns}
        searchPlaceholder={t('usage.search')}
        noResultsMessage={t('usage.empty')}
        enableRowSelection={false}
        enableStatusFilter={false}
        defaultSort='created_at'
      />
    </AdminPageShell>
  )
}
