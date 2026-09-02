import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { CreateKnowledgeBaseDialog } from './components/create-knowledge-base-dialog'
import { KnowledgeBaseGrid } from './components/knowledge-base-grid'
import { type KnowledgeBaseItem } from './data/knowledge-types'

export function KnowledgeBase() {
  const [items, setItems] = useState<KnowledgeBaseItem[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleCreate = (data: Omit<KnowledgeBaseItem, 'id' | 'createdAt'>) => {
    setItems((prev) => [
      {
        ...data,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      },
      ...prev,
    ])
  }

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
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
            <h2 className='text-2xl font-bold tracking-tight'>知识库</h2>
            <p className='text-muted-foreground'>
              创建并管理你的知识库，为智能应用提供数据支撑。
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className='size-4' />
            创建知识库
          </Button>
        </div>

        <KnowledgeBaseGrid items={items} onDelete={handleDelete} />
      </Main>

      <CreateKnowledgeBaseDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreate={handleCreate}
      />
    </>
  )
}
