import { useMemo, useState } from 'react'
import { Save, Upload } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ModuleItem } from '@/api/modules.types'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { PermissionGuard } from '@/components/guard'
import { Button } from '@/components/ui/button'
import { PERMISSIONS } from '@/shared/permissions'
import { applyPlan, diffState, type EnabledMap, planToggle, type TogglePlan } from '../data/module-deps'
import { useModuleMutations, useModules } from '../hooks/use-modules'
import { ModuleCard } from './module-card'
import { ModuleConfirms, type PendingAction } from './module-confirms'
import { ModuleUploadDialog } from './module-upload-dialog'
import { type ModuleFilter, ModulesToolbar } from './modules-toolbar'

const toMap = (list: ModuleItem[]): EnabledMap => Object.fromEntries(list.map((m) => [m.id, m.enabled]))

export function ModulesPage() {
  const { t } = useTranslation('modules')
  const { data } = useModules()
  const { save, update, remove } = useModuleMutations()
  const modules = useMemo(() => data?.data ?? [], [data])
  const server = useMemo(() => toMap(modules), [modules])

  const [local, setLocal] = useState<EnabledMap>({})
  const state = { ...server, ...local }
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<ModuleFilter>('all')
  const [pending, setPending] = useState<PendingAction | null>(null)
  const [uploadOpen, setUploadOpen] = useState(false)

  const changes = diffState(server, state)
  const names = (ids: string[]) => ids.map((id) => modules.find((m) => m.id === id)?.name ?? id)
  const commit = (id: string, enable: boolean, plan: TogglePlan) => setLocal(applyPlan(state, id, enable, plan))

  const toggle = (id: string, enable: boolean) => {
    const plan = planToggle(modules, state, id, enable)
    if (!plan.ok || plan.also.length) setPending({ kind: 'toggle', id, enable, plan })
    else commit(id, enable, plan)
  }

  const askDelete = (id: string) =>
    setPending({
      kind: 'delete',
      id,
      dependants: names(modules.filter((x) => x.requires.includes(id)).map((x) => x.id)),
    })

  const visible = modules.filter((m) => {
    const on = !!state[m.id]
    const byFilter =
      filter === 'all' ||
      (filter === 'notInstalled' ? !m.installed : m.installed && (filter === 'active' ? on : !on))
    return byFilter && `${m.name} ${m.id}`.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <AdminPageShell
      title={t('title')}
      description={t('description')}
      actions={
        <div className='flex gap-2'>
          <PermissionGuard permission={PERMISSIONS.MODULES.INSTALL}>
            <Button variant='outline' onClick={() => setUploadOpen(true)}>
              <Upload className='me-2 size-4' />
              {t('upload.open')}
            </Button>
          </PermissionGuard>
          <PermissionGuard permission={PERMISSIONS.MODULES.TOGGLE}>
            <Button
              disabled={!changes.length || save.isPending}
              onClick={() => save.mutate(changes, { onSuccess: () => setLocal({}) })}
            >
              <Save className='me-2 size-4' />
              {t('save', { count: changes.length })}
            </Button>
          </PermissionGuard>
        </div>
      }
    >
      <ModulesToolbar search={search} onSearch={setSearch} filter={filter} onFilter={setFilter} />
      {visible.length === 0 ? (
        <p className='py-8 text-center text-sm text-muted-foreground'>{t('empty')}</p>
      ) : (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {visible.map((m) => (
            <ModuleCard
              key={m.id}
              module={m}
              enabled={!!state[m.id]}
              missingDeps={names(m.requires.filter((r) => !state[r]))}
              onToggle={(on) => toggle(m.id, on)}
              onUpdate={() => update.mutate(m.id)}
              onDelete={() => askDelete(m.id)}
            />
          ))}
        </div>
      )}
      <ModuleConfirms
        pending={pending}
        names={names}
        onClose={() => setPending(null)}
        onToggle={commit}
        onDelete={(id) => remove.mutate(id)}
      />
      <ModuleUploadDialog key={String(uploadOpen)} open={uploadOpen} onOpenChange={setUploadOpen} />
    </AdminPageShell>
  )
}
