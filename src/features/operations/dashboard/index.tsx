import { useState, useEffect, useMemo } from 'react'
import { RefreshCcw, Printer, Tag, Bluetooth } from 'lucide-react'
import { connectLabelPrinter } from '@/utils/label-printer'
import { connectReceiptPrinter } from '@/utils/printer'
import { useKdsBoard } from '@/hooks/queries/use-kds-board'
import { useAppStore } from '@/hooks/use-app-store'
import { BrandLoader } from '@/components/ui/brand-loader'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { KanbanBoard } from '@/features/operations/_components/kanban-board'
import { ManualOrderPanel } from '@/features/operations/_components/manual-order-panel'

export default function OperationsPage() {
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [showConnectDialog, setShowConnectDialog] = useState(false)
  const activeShop = useAppStore((state) => state.activeShop)
  const shopId = useAppStore((state) => state.activeShopId)

  const {
    data: boardStateData,
    isLoading,
    refetch,
  } = useKdsBoard(shopId || undefined, autoRefresh)

  // Show the printer connect dialog only after auto-connect has exhausted all retries
  useEffect(() => {
    const onFailed = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const isReceiptConnected = !!(window as any).cachedPrinterDevice?.gatt
        ?.connected
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const isLabelConnected = !!(window as any).cachedLabelPrinterDevice?.gatt
        ?.connected
      // Only open if at least one printer is still not connected
      if (!isReceiptConnected || !isLabelConnected) {
        setShowConnectDialog(true)
      }
    }

    window.addEventListener('printer-connect-failed', onFailed)
    return () => window.removeEventListener('printer-connect-failed', onFailed)
  }, [])

  const handleConnectReceipt = async () => {
    await connectReceiptPrinter()
  }

  const handleConnectLabel = async () => {
    await connectLabelPrinter()
  }

  const handleDismissDialog = () => {
    setShowConnectDialog(false)
  }

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
      {/* Startup Printer Connection Dialog */}
      <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
        <DialogContent className='sm:max-w-sm'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <Bluetooth className='h-5 w-5 text-primary' />
              Connect Printers
            </DialogTitle>
            <DialogDescription>
              Connect your printers before starting to ensure orders print
              automatically.
            </DialogDescription>
          </DialogHeader>
          <div className='flex flex-col gap-3 py-2'>
            <Button className='w-full' size='lg' onClick={handleConnectReceipt}>
              <Printer className='mr-2 h-5 w-5' />
              Connect Receipt Printer
            </Button>
            <Button
              className='w-full'
              size='lg'
              variant='outline'
              onClick={handleConnectLabel}
            >
              <Tag className='mr-2 h-5 w-5' />
              Connect Label Printer
            </Button>
            <Button
              variant='ghost'
              className='w-full text-muted-foreground'
              onClick={handleDismissDialog}
            >
              Skip for now
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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

          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={connectReceiptPrinter}
              title='Connect Receipt Printer'
            >
              <Printer className='mr-1 h-4 w-4' />
              Receipt
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={connectLabelPrinter}
              title='Connect Label Printer'
            >
              <Tag className='mr-1 h-4 w-4' />
              Label
            </Button>
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
