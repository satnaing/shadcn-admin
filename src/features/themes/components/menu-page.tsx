import { useState } from 'react'
import { Plus, Save } from 'lucide-react'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FALLBACK_FORM_LOCALES } from '@/shared/constants/locales'
import { addChild, makeNode, nextNodeId, removeNode, updateNode } from '../data/menu-tree'
import type { MenuLocation, MenuNode } from '../data/themes.type'
import { useMenusQuery, useSaveMenu } from '../hooks/useMenus'
import { useThemeT } from '../hooks/useThemeT'
import { LocaleSwitch } from './locale-switch'
import { MenuNodeDialog } from './menu-node-dialog'
import { MenuTree } from './menu-tree'

const LOCATIONS: MenuLocation[] = ['header', 'footer', 'mobile', 'tools']

export function MenuPage() {
  const t = useThemeT()
  const query = useMenusQuery()
  const save = useSaveMenu()
  const [location, setLocation] = useState<MenuLocation>('header')
  const [locale, setLocale] = useState<string>(FALLBACK_FORM_LOCALES[0])
  const [drafts, setDrafts] = useState<Partial<Record<MenuLocation, MenuNode[]>>>({})
  const [editing, setEditing] = useState<MenuNode | null>(null)

  const saved = query.data?.data?.find((menu) => menu.location === location)?.items ?? []
  const items = drafts[location] ?? saved
  const change = (next: MenuNode[]) => setDrafts((prev) => ({ ...prev, [location]: next }))
  const add = (parentId: string | null) => change(addChild(items, parentId, makeNode(nextNodeId(items))))

  const handlers = {
    locale,
    onEdit: setEditing,
    onAddChild: add,
    onRemove: (id: string) => change(removeNode(items, id)),
    onToggle: (id: string) => change(updateNode(items, id, (node) => ({ ...node, enabled: !node.enabled }))),
  }

  const persist = () =>
    save.mutate({ location, items }, { onSuccess: () => setDrafts((prev) => ({ ...prev, [location]: undefined })) })

  return (
    <AdminPageShell
      title={t('page.menu')}
      description={t('page.menu.description')}
      actions={
        <div className='flex items-center gap-2'>
          <LocaleSwitch value={locale} onChange={setLocale} />
          <Button variant='outline' onClick={() => add(null)}>
            <Plus className='size-4' /> {t('menu.addRoot')}
          </Button>
          <Button disabled={!drafts[location] || save.isPending} onClick={persist}>
            <Save className='size-4' /> {t('common.save')}
          </Button>
        </div>
      }
    >
      <Tabs value={location} onValueChange={(value) => setLocation(value as MenuLocation)}>
        <TabsList>
          {LOCATIONS.map((name) => (
            <TabsTrigger key={name} value={name}>
              {t(`menu.location.${name}`)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {query.isLoading && <Skeleton className='h-64 w-full' />}
      {query.isError && <p className='text-destructive'>{t('common.loadFailed')}</p>}
      {!query.isLoading && items.length === 0 && <p className='text-muted-foreground'>{t('common.empty')}</p>}
      {items.length > 0 && <MenuTree items={items} onChange={change} handlers={handlers} />}

      <MenuNodeDialog
        node={editing}
        locale={locale}
        onClose={() => setEditing(null)}
        onSave={(node) => {
          change(updateNode(items, node.id, () => node))
          setEditing(null)
        }}
      />
    </AdminPageShell>
  )
}
