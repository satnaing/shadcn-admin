import { useState } from 'react'
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { Skeleton } from '@/components/ui/skeleton'
import { FALLBACK_FORM_LOCALES } from '@/shared/constants/locales'
import { BANNER_GROUPS, emptyBanner } from '../data/banner-defaults'
import type { Banner, BannerDraft } from '../data/themes.type'
import { useBannerMutations, useBannersQuery } from '../hooks/useBanners'
import { useThemeT } from '../hooks/useThemeT'
import { useActiveTheme } from '../hooks/useThemes'
import { BannerDialog } from './banner-dialog'
import { BannerRow } from './banner-row'
import { ALL, FilterSelect } from './banners-filters'
import { GroupSettingsCard } from './group-settings-card'

const PER_PAGE = 8

export function BannersPage() {
  const t = useThemeT()
  const [group, setGroup] = useState(ALL)
  const [locale, setLocale] = useState(ALL)
  const [editing, setEditing] = useState<(BannerDraft & Partial<Pick<Banner, 'id'>>) | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const q = useDebouncedValue(search.trim())
  const query = useBannersQuery({
    q: q || undefined,
    page,
    per_page: PER_PAGE,
    sort: 'order',
    group: group === ALL ? undefined : group,
    locale: locale === ALL ? undefined : locale,
  })
  const meta = query.data?.meta
  const { create, update, remove, toggle, reorder } = useBannerMutations()
  const lockedColors = useActiveTheme()?.token_policy === 'locked'
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
  const rows = query.data?.data ?? []
  const reset = (apply: () => void) => () => {
    apply()
    setPage(1)
  }

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    const from = rows.findIndex((row) => String(row.id) === active.id)
    const to = rows.findIndex((row) => String(row.id) === over.id)
    reorder.mutate(arrayMove(rows, from, to).map((row) => row.id))
  }

  const save = (draft: BannerDraft, id?: number) => {
    const done = { onSuccess: () => setEditing(null) }
    if (id) update.mutate({ id, draft }, done)
    else create.mutate(draft, done)
  }

  return (
    <AdminPageShell
      title={t('page.banners')}
      description={t('page.banners.description')}
      actions={
        <div className='flex flex-wrap items-center gap-2'>
          <Input className='w-48' value={search} placeholder={t('banners.search')} onChange={(e) => { setSearch(e.target.value); setPage(1) }} />
          <FilterSelect value={group} onChange={(v) => reset(() => setGroup(v))()} options={[...BANNER_GROUPS]} label={t('leaf.group')} />
          <FilterSelect value={locale} onChange={(v) => reset(() => setLocale(v))()} options={[...FALLBACK_FORM_LOCALES]} label={t('banners.language')} />
          <Button onClick={() => setEditing(emptyBanner(group === ALL ? 'hero-slider' : (group as BannerDraft['group'])))}>
            <Plus className='size-4' /> {t('banners.create')}
          </Button>
        </div>
      }
    >
      {group !== ALL && <GroupSettingsCard group={group} />}
      {query.isLoading && <Skeleton className='h-48 w-full' />}
      {query.isError && <p className='text-destructive'>{t('common.loadFailed')}</p>}
      {!query.isLoading && !query.isError && rows.length === 0 && <p className='text-muted-foreground'>{t('common.empty')}</p>}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={rows.map((row) => String(row.id))} strategy={verticalListSortingStrategy}>
          <ul className='space-y-2'>
            {rows.map((row) => (
              <BannerRow
                key={row.id}
                banner={row}
                locale={locale === ALL ? 'az' : locale}
                onToggle={(id) => toggle.mutate(id)}
                onEdit={setEditing}
                onDelete={(id) => remove.mutate(id)}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      {meta && meta.last_page > 1 && (
        <div className='flex items-center justify-end gap-2 text-sm'>
          <Button variant='outline' size='sm' disabled={page <= 1} onClick={() => setPage(page - 1)}>
            {t('common.prev')}
          </Button>
          <span>{page} / {meta.last_page}</span>
          <Button variant='outline' size='sm' disabled={page >= meta.last_page} onClick={() => setPage(page + 1)}>
            {t('common.next')}
          </Button>
        </div>
      )}

      <BannerDialog
        banner={editing}
        lockedColors={lockedColors}
        pending={create.isPending || update.isPending}
        onSave={save}
        onClose={() => setEditing(null)}
      />
    </AdminPageShell>
  )
}
