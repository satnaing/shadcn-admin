import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { AppGrid } from './components/app-grid'
import { CreateAppDialog } from './components/create-app-dialog'
import { type AppItem, methodToType } from './data/app-types'

export function AppPlaza() {
  const [apps, setApps] = useState<AppItem[]>([])
  const [tab, setTab] = useState('all')
  const [dialogOpen, setDialogOpen] = useState(false)

  const filteredApps = useMemo(() => {
    if (tab === 'all') return apps
    return apps.filter((app) => methodToType(app.method) === tab)
  }, [apps, tab])

  const handleCreate = (data: Omit<AppItem, 'id' | 'createdAt'>) => {
    setApps((prev) => [
      {
        ...data,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      },
      ...prev,
    ])
  }

  const handleDelete = (id: string) => {
    setApps((prev) => prev.filter((app) => app.id !== id))
  }

  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>应用广场</h2>
            <p className='text-muted-foreground'>
              在这里创建和管理你的智能应用。
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className='size-4' />
            创建应用
          </Button>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value='all'>全部</TabsTrigger>
            <TabsTrigger value='dialogue'>对话型</TabsTrigger>
            <TabsTrigger value='workflow'>工作流型</TabsTrigger>
          </TabsList>
          <TabsContent value={tab} className='mt-4'>
            <AppGrid apps={filteredApps} onDelete={handleDelete} />
          </TabsContent>
        </Tabs>
      </Main>

      <CreateAppDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreate={handleCreate}
      />
    </>
  )
}
