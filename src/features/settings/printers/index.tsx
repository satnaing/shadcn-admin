'use client'
import { useState } from 'react'
import {
  Bluetooth,
  BluetoothOff,
  Tag,
  Printer,
  Loader2,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react'
import { toast } from 'sonner'
import { printLabelViaBluetooth } from '@/utils/label-printer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

// --- Printer BT service UUIDs ---
const RECEIPT_SERVICE_UUID = '000018f0-0000-1000-8000-00805f9b34fb'
const RECEIPT_CHAR_UUID = '00002af1-0000-1000-8000-00805f9b34fb'
const RECEIPT_FILTER_PREFIXES = ['XP-58', 'XP-80', 'XP', 'Printer']

const LABEL_SERVICE_UUID = '000018f0-0000-1000-8000-00805f9b34fb'
const LABEL_CHAR_UUID = '00002af1-0000-1000-8000-00805f9b34fb'
const LABEL_FILTER_PREFIXES = ['XP-410', 'XP-410B', 'XP', 'Printer']

type PrinterStatus = 'connected' | 'disconnected' | 'connecting'

interface PrinterInfo {
  name: string
  status: PrinterStatus
  deviceName?: string
}

export function SettingsPrinters() {
  const [receipt, setReceipt] = useState<PrinterInfo>(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rd = window.cachedPrinterDevice as any
    if (rd?.gatt?.connected) {
      return {
        name: 'Receipt Printer',
        status: 'connected',
        deviceName: rd.name,
      }
    }
    return { name: 'Receipt Printer', status: 'disconnected' }
  })
  const [label, setLabel] = useState<PrinterInfo>(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ld = window.cachedLabelPrinterDevice as any
    if (ld?.gatt?.connected) {
      return {
        name: 'Label Printer (XP-410B)',
        status: 'connected',
        deviceName: ld.name,
      }
    }
    return { name: 'Label Printer (XP-410B)', status: 'disconnected' }
  })

  // --- Helpers ---

  const connectReceiptPrinter = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bluetooth = (navigator as any).bluetooth
    if (!bluetooth) {
      toast.error(
        'Bluetooth is not supported. On iOS, please use the Bluefy or WebBLE app.'
      )
      return
    }
    setReceipt((p) => ({ ...p, status: 'connecting' }))
    try {
      const device = await bluetooth.requestDevice({
        filters: RECEIPT_FILTER_PREFIXES.map((p) => ({ namePrefix: p })),
        optionalServices: [RECEIPT_SERVICE_UUID],
      })
      const server = await device.gatt.connect()
      await server
        .getPrimaryService(RECEIPT_SERVICE_UUID)
        .then((s: { getCharacteristic: (arg0: string) => unknown }) =>
          s.getCharacteristic(RECEIPT_CHAR_UUID)
        )

      window.cachedPrinterDevice = device
      device.addEventListener('gattserverdisconnected', () => {
        window.cachedPrinterDevice = null
        setReceipt((p) => ({
          ...p,
          status: 'disconnected',
          deviceName: undefined,
        }))
        toast.info('Receipt printer disconnected.')
      })
      setReceipt({
        name: 'Receipt Printer',
        status: 'connected',
        deviceName: device.name,
      })
      toast.success(`Receipt printer connected: ${device.name}`)
    } catch (err: unknown) {
      const e = err as Error
      setReceipt((p) => ({ ...p, status: 'disconnected' }))
      if (!e.message?.includes('cancelled')) {
        toast.error(`Connection failed: ${e.message}`)
      }
    }
  }

  const disconnectReceiptPrinter = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const device = window.cachedPrinterDevice as any
    if (device?.gatt?.connected) {
      await device.gatt.disconnect()
    }
    window.cachedPrinterDevice = null
    setReceipt((p) => ({ ...p, status: 'disconnected', deviceName: undefined }))
    toast.info('Receipt printer disconnected.')
  }

  const connectLabelPrinter = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bluetooth = (navigator as any).bluetooth
    if (!bluetooth) {
      toast.error(
        'Bluetooth is not supported. On iOS, please use the Bluefy or WebBLE app.'
      )
      return
    }
    setLabel((p) => ({ ...p, status: 'connecting' }))
    try {
      const device = await bluetooth.requestDevice({
        filters: LABEL_FILTER_PREFIXES.map((p) => ({ namePrefix: p })),
        optionalServices: [LABEL_SERVICE_UUID],
      })
      const server = await device.gatt.connect()
      await server
        .getPrimaryService(LABEL_SERVICE_UUID)
        .then((s: { getCharacteristic: (arg0: string) => unknown }) =>
          s.getCharacteristic(LABEL_CHAR_UUID)
        )

      window.cachedLabelPrinterDevice = device
      device.addEventListener('gattserverdisconnected', () => {
        window.cachedLabelPrinterDevice = null
        setLabel((p) => ({
          ...p,
          status: 'disconnected',
          deviceName: undefined,
        }))
        toast.info('Label printer disconnected.')
      })
      setLabel({
        name: 'Label Printer (XP-410B)',
        status: 'connected',
        deviceName: device.name,
      })
      toast.success(`Label printer connected: ${device.name}`)
    } catch (err: unknown) {
      const e = err as Error
      setLabel((p) => ({ ...p, status: 'disconnected' }))
      if (!e.message?.includes('cancelled')) {
        toast.error(`Connection failed: ${e.message}`)
      }
    }
  }

  const disconnectLabelPrinter = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const device = window.cachedLabelPrinterDevice as any
    if (device?.gatt?.connected) {
      await device.gatt.disconnect()
    }
    window.cachedLabelPrinterDevice = null
    setLabel((p) => ({ ...p, status: 'disconnected', deviceName: undefined }))
    toast.info('Label printer disconnected.')
  }

  const testReceiptPrinter = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const device = window.cachedPrinterDevice as any
    if (!device?.gatt?.connected) {
      toast.error('Receipt printer is not connected.')
      return
    }
    try {
      const server = device.gatt
      const service = await server.getPrimaryService(RECEIPT_SERVICE_UUID)
      const characteristic = await service.getCharacteristic(RECEIPT_CHAR_UUID)

      // Build a tiny ESC/POS test receipt manually (avoid circular import)
      const encoder = new TextEncoder()
      const lines = [
        new Uint8Array([0x1b, 0x40]), // INIT
        new Uint8Array([0x1b, 0x61, 0x01]), // ALIGN CENTER
        new Uint8Array([0x1b, 0x45, 0x01]), // BOLD ON
        encoder.encode('TEST PRINT\n'),
        new Uint8Array([0x1b, 0x45, 0x00]), // BOLD OFF
        encoder.encode('Receipt printer OK!\n'),
        encoder.encode(new Date().toLocaleString() + '\n'),
        new Uint8Array([0x0a]), // LF
        new Uint8Array([0x1d, 0x56, 0x42, 0x00]), // FEED & CUT
      ]
      const totalLen = lines.reduce((acc, b) => acc + b.length, 0)
      const buf = new Uint8Array(totalLen)
      let offset = 0
      for (const b of lines) {
        buf.set(b, offset)
        offset += b.length
      }

      const CHUNK_SIZE = 64
      for (let i = 0; i < buf.length; i += CHUNK_SIZE) {
        await characteristic.writeValue(buf.slice(i, i + CHUNK_SIZE))
        await new Promise((r) => setTimeout(r, 20))
      }
      toast.success('Test receipt printed!')
    } catch (err: unknown) {
      toast.error(`Test failed: ${(err as Error).message}`)
    }
  }

  const testLabelPrinter = async () => {
    await printLabelViaBluetooth({
      drinkName: 'Test Drink',
      variant: 'Iced / Normal Sugar',
      note: 'Printer test OK',
      orderCode: 'YOK-TEST',
      quantity: 1,
    })
  }

  return (
    <div className='space-y-6 p-4 md:p-6'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>Printer Settings</h1>
        <p className='mt-1 text-sm text-muted-foreground'>
          Manage Bluetooth connections for your receipt and label printers.
        </p>
      </div>

      <Separator />

      <div className='grid gap-4 md:grid-cols-2'>
        {/* --- Receipt Printer --- */}
        <PrinterCard
          icon={<Printer className='h-5 w-5' />}
          title='Receipt Printer'
          description='80mm thermal printer (ESC/POS) — e.g. Xprinter XP-58'
          info={receipt}
          onConnect={connectReceiptPrinter}
          onDisconnect={disconnectReceiptPrinter}
          onTestPrint={testReceiptPrinter}
        />

        {/* --- Label Printer --- */}
        <PrinterCard
          icon={<Tag className='h-5 w-5' />}
          title='Label Printer'
          description='40x25mm sticker printer (TSPL) — Xprinter XP-410B'
          info={label}
          onConnect={connectLabelPrinter}
          onDisconnect={disconnectLabelPrinter}
          onTestPrint={testLabelPrinter}
        />
      </div>

      <Separator />

      <div className='space-y-1 rounded-md bg-muted p-4 text-sm text-muted-foreground'>
        <p className='font-medium text-foreground'>💡 Tips</p>
        <p>
          • Connections are cached in this browser tab. Refreshing the page will
          clear the connection.
        </p>
        <p>
          • For best results, connect your printers here <strong>before</strong>{' '}
          going to the Operations page.
        </p>
        <p>
          • If a printer shows "Connected" but fails to print, tap Disconnect
          and reconnect.
        </p>
      </div>
    </div>
  )
}

// --- Reusable Printer Card Component ---

interface PrinterCardProps {
  icon: React.ReactNode
  title: string
  description: string
  info: PrinterInfo
  onConnect: () => void
  onDisconnect: () => void
  onTestPrint?: () => void
}

function PrinterCard({
  icon,
  title,
  description,
  info,
  onConnect,
  onDisconnect,
  onTestPrint,
}: PrinterCardProps) {
  const isConnected = info.status === 'connected'
  const isConnecting = info.status === 'connecting'

  return (
    <Card>
      <CardHeader className='pt-4 pb-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            {icon}
            <CardTitle className='text-base'>{title}</CardTitle>
          </div>
          <StatusBadge status={info.status} />
        </div>
        <CardDescription className='text-xs'>{description}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-3 py-4'>
        {isConnected && info.deviceName && (
          <div className='flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-xs'>
            <CheckCircle2 className='h-3.5 w-3.5 shrink-0 text-green-500' />
            <span className='truncate font-mono'>{info.deviceName}</span>
          </div>
        )}

        <div className='flex gap-2'>
          {!isConnected ? (
            <Button
              size='sm'
              className='flex-1'
              onClick={onConnect}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <Loader2 className='mr-2 h-3.5 w-3.5 animate-spin' />
              ) : (
                <Bluetooth className='mr-2 h-3.5 w-3.5' />
              )}
              {isConnecting ? 'Connecting...' : 'Connect'}
            </Button>
          ) : (
            <>
              <Button
                size='sm'
                variant='outline'
                className='flex-1'
                onClick={onConnect}
              >
                <RefreshCw className='mr-2 h-3.5 w-3.5' />
                Reconnect
              </Button>
              <Button
                size='sm'
                variant='destructive'
                className='flex-1'
                onClick={onDisconnect}
              >
                <BluetoothOff className='mr-2 h-3.5 w-3.5' />
                Disconnect
              </Button>
            </>
          )}
        </div>
        {/* Test print button — only visible when connected */}
        {isConnected && onTestPrint && (
          <Button
            size='sm'
            variant='secondary'
            className='w-full'
            onClick={onTestPrint}
          >
            Test Print
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: PrinterStatus }) {
  if (status === 'connected') {
    return (
      <Badge className='border-green-200 bg-green-100 text-green-700 hover:bg-green-100'>
        Connected
      </Badge>
    )
  }
  if (status === 'connecting') {
    return (
      <Badge variant='outline' className='border-yellow-400 text-yellow-600'>
        Connecting...
      </Badge>
    )
  }
  return (
    <Badge variant='outline' className='text-muted-foreground'>
      Disconnected
    </Badge>
  )
}
