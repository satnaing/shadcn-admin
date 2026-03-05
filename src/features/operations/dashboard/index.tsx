import { useState, useMemo } from 'react'
import { RefreshCcw } from 'lucide-react'
import { useKdsBoard } from '@/hooks/queries/use-kds-board'
import { useAppStore } from '@/hooks/use-app-store'
import { BrandLoader } from '@/components/ui/brand-loader'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { KanbanBoard } from '@/features/operations/_components/kanban-board'
import { ManualOrderPanel } from '@/features/operations/_components/manual-order-panel'

export default function OperationsPage() {
  const [autoRefresh, setAutoRefresh] = useState(true)
  const activeShop = useAppStore((state) => state.activeShop)
  const shopId = useAppStore((state) => state.activeShopId)

  const {
    data: boardStateData,
    isLoading,
    refetch,
  } = useKdsBoard(shopId || undefined, autoRefresh)

  const shopDisplayName = useMemo(() => {
    if (!activeShop) return shopId || 'Global View'
    const name = activeShop.name as Record<string, string> | string
    if (typeof name === 'string') return name
    return name?.en || name?.km || activeShop.code || 'Shop'
  }, [activeShop, shopId])

  if (isLoading) {
    return (
      <div className='flex h-full items-center justify-center p-6'>
        <BrandLoader />
      </div>
    )
  }

  const boardState = boardStateData || {}

  return (
    <div
      data-layout='fixed'
      className='flex h-full flex-col overflow-hidden bg-background'
    >
      {/* Header */}
      <header className='flex h-16 shrink-0 items-center justify-between border-b bg-card px-6'>
        <div className='flex items-center gap-4'>
          <h1 className='text-xl font-bold tracking-tight'>
            Live KDS - {shopDisplayName}
          </h1>
          <span className='rounded bg-muted px-2 py-1 text-xs text-muted-foreground'>
            Live
          </span>
        </div>

        <div className='flex items-center gap-6'>
          <div className='flex items-center space-x-2'>
            <Switch
              id='auto-refresh'
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
            />
            <Label
              htmlFor='auto-refresh'
              className='flex cursor-pointer items-center gap-2'
            >
              {autoRefresh && <RefreshCcw className='h-3 w-3 animate-spin' />}
              Auto-Polling (30s)
            </Label>
          </div>
          <Button variant='outline' size='sm' onClick={() => refetch()}>
            <RefreshCcw className='mr-2 h-4 w-4' />
            Refresh
          </Button>
          <ManualOrderPanel />
        </div>
      </header>
      {/* Board Content */}
      <main className='flex min-h-0 flex-1 flex-col overflow-hidden pt-6'>
        <KanbanBoard boardState={boardState} />
      </main>
    </div>
  )
}
