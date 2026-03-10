'use client'
import { useEffect, useState } from 'react'
import { Bluetooth, Printer, Tag } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type PrinterState = 'connected' | 'reconnecting' | 'disconnected'

interface PrintersState {
  receipt: PrinterState
  label: PrinterState
}

/** Returns true if a cached device is GATT-connected */
function isGattConnected(device: unknown): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return !!(device as any)?.gatt?.connected
}

export function PrinterStatusIndicator() {
  const [state, setState] = useState<PrintersState>({
    receipt: 'disconnected',
    label: 'disconnected',
  })

  useEffect(() => {
    /** Sync state from window globals */
    const sync = () => {
      setState((prev) => {
        const nextReceipt: PrinterState = isGattConnected(
          window.cachedPrinterDevice
        )
          ? 'connected'
          : // keep 'reconnecting' if already set and device is still cached (not null)
            window.cachedPrinterDevice && prev.receipt === 'reconnecting'
            ? 'reconnecting'
            : 'disconnected'

        const nextLabel: PrinterState = isGattConnected(
          window.cachedLabelPrinterDevice
        )
          ? 'connected'
          : window.cachedLabelPrinterDevice && prev.label === 'reconnecting'
            ? 'reconnecting'
            : 'disconnected'

        if (nextReceipt === prev.receipt && nextLabel === prev.label) {
          return prev // avoid re-render
        }
        return { receipt: nextReceipt, label: nextLabel }
      })
    }

    const interval = setInterval(sync, 1000)

    /** Listen for reconnecting events emitted by the auto-connect hook */
    const onReconnecting = (e: Event) => {
      const { printerType } = (
        e as CustomEvent<{ printerType: 'receipt' | 'label' }>
      ).detail
      setState((prev) => ({ ...prev, [printerType]: 'reconnecting' }))
    }

    window.addEventListener('printer-reconnecting', onReconnecting)

    // Initial sync
    sync()

    return () => {
      clearInterval(interval)
      window.removeEventListener('printer-reconnecting', onReconnecting)
    }
  }, [])

  const anyVisible =
    state.receipt !== 'disconnected' || state.label !== 'disconnected'

  if (!anyVisible) return null

  return (
    <TooltipProvider delayDuration={200}>
      <div className='flex items-center gap-1'>
        {state.receipt !== 'disconnected' && (
          <PrinterDot
            type='receipt'
            status={state.receipt}
            label='Receipt Printer'
            Icon={Printer}
          />
        )}
        {state.label !== 'disconnected' && (
          <PrinterDot
            type='label'
            status={state.label}
            label='Label Printer'
            Icon={Tag}
          />
        )}
      </div>
    </TooltipProvider>
  )
}

interface PrinterDotProps {
  type: 'receipt' | 'label'
  status: 'connected' | 'reconnecting'
  label: string
  Icon: React.ComponentType<{ className?: string }>
}

function PrinterDot({ status, label, Icon }: PrinterDotProps) {
  const isReconnecting = status === 'reconnecting'

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className='relative flex h-8 w-8 cursor-default items-center justify-center rounded-md transition-colors hover:bg-accent'>
          {/* Printer icon */}
          <Icon
            className={
              isReconnecting
                ? 'h-4 w-4 text-muted-foreground'
                : 'h-4 w-4 text-foreground'
            }
          />

          {/* Status dot / spinner overlay in bottom-right corner */}
          {isReconnecting ? (
            <span className='absolute right-0.5 bottom-0.5 flex h-2.5 w-2.5 items-center justify-center'>
              {/* Spinning ring */}
              <span className='absolute inline-flex h-full w-full animate-spin rounded-full border-2 border-transparent border-t-blue-500' />
              {/* Bluetooth mini icon */}
              <Bluetooth className='h-1.5 w-1.5 text-blue-500' />
            </span>
          ) : (
            <>
              {/* Green pulse dot */}
              <span className='absolute right-0.5 bottom-0.5 flex h-2.5 w-2.5'>
                <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60' />
                <span className='relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500' />
              </span>
            </>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent side='bottom' className='text-xs'>
        <span className='font-medium'>{label}</span>
        <br />
        <span className={isReconnecting ? 'text-blue-400' : 'text-green-400'}>
          {isReconnecting ? '🔄 Reconnecting…' : '✅ Connected'}
        </span>
      </TooltipContent>
    </Tooltip>
  )
}
