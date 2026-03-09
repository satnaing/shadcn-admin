import { type ReceiptProps } from '@/types/api'
import { toast } from 'sonner'
import {
  generateReceiptBlob,
  // generateReceiptBlobFromCanvas,
} from '@/features/operations/_components/receipt-escpos-generator'

export const connectReceiptPrinter = async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bluetooth = (navigator as any).bluetooth

  if (!bluetooth) {
    toast.error(
      'Bluetooth is not supported. On iOS, please use the Bluefy or WebBLE app.'
    )
    return
  }

  try {
    const device = await bluetooth.requestDevice({
      filters: [
        { services: ['000018f0-0000-1000-8000-00805f9b34fb'] }, // Common ESC/POS service
        { namePrefix: 'XP' }, // Xprinter
        { namePrefix: 'Printer' },
      ],
      optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb'],
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).cachedPrinterDevice = device

    device.addEventListener('gattserverdisconnected', () => {
      // eslint-disable-next-line no-console
      console.log('Printer disconnected')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).cachedPrinterDevice = null
    })

    if (device.gatt && !device.gatt.connected) {
      await device.gatt.connect()
    }
    toast.success('Receipt printer connected successfully!')
  } catch (error: unknown) {
    const err = error as Error
    if (err?.message && !err.message.includes('User cancelled')) {
      toast.error(`Print Error: ${err.message}`)
    }
  }
}

export const printReceiptViaBluetooth = async (orders: ReceiptProps[]) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bluetooth = (navigator as any).bluetooth

  if (!bluetooth) {
    toast.error(
      window.isSecureContext
        ? 'Bluetooth is not supported. On iOS, please use the Bluefy or WebBLE app.'
        : 'Bluetooth requires HTTPS. Please open the app via the production URL.'
    )
    return
  }

  try {
    let device = window.cachedPrinterDevice as any

    if (!device || !device.gatt?.connected) {
      // Attempt to find it from already permitted devices first (desktop Chrome only)
      if (bluetooth.getDevices) {
        const devices = await bluetooth.getDevices()
        const found = devices.find((d: any) =>
          ['XP-58', 'XP-80', 'XP', 'Printer'].some((prefix) =>
            d.name?.startsWith(prefix)
          )
        )
        if (found) {
          try {
            if (!found.gatt?.connected) {
              await found.gatt.connect()
            }
            device = found
          } catch {
            // Failed to auto-reconnect, fall through to request a new device
          }
        }
      }

      // If still no device, prompt the user
      if (!device) {
        device = await bluetooth.requestDevice({
          filters: [
            { services: ['000018f0-0000-1000-8000-00805f9b34fb'] }, // Common ESC/POS service
            { namePrefix: 'XP' }, // Xprinter
            { namePrefix: 'Printer' },
          ],
          optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb'],
        })
      }

      // Cache the device on the window object so we can reuse it
      window.cachedPrinterDevice = device

      device.addEventListener('gattserverdisconnected', () => {
        // eslint-disable-next-line no-console
        console.log('Printer disconnected')
        window.cachedPrinterDevice = null
      })
    }

    if (!device.gatt) throw new Error('Cannot connect to GATT')

    // Connect to GATT if not already connected
    let server = device.gatt.connected ? device.gatt : null
    if (!server) {
      server = await device.gatt.connect()
    }
    const service = await server.getPrimaryService(
      '000018f0-0000-1000-8000-00805f9b34fb'
    )
    const characteristic = await service.getCharacteristic(
      '00002af1-0000-1000-8000-00805f9b34fb'
    )

    // 2. Generate raw text ESC/POS commands
    const receiptBytesList = orders.map((o) => generateReceiptBlob(o))

    const totalLength = receiptBytesList.reduce(
      (acc, curr) => acc + curr.length,
      0
    )
    const receiptBytes = new Uint8Array(totalLength)
    let offset = 0
    for (const bytes of receiptBytesList) {
      receiptBytes.set(bytes, offset)
      offset += bytes.length
    }

    // 3. Write chunks (Image data is large, so use small chunks to avoid MTU limits)
    // We must use extremely conservative chunk sizes (64 bytes) and forced 20ms delays.
    // Any attempt to speed this up will overflow the cheap UART buffer on thermal
    // printers, resulting in corrupted image bytes printing out as garbage text.
    const CHUNK_SIZE = 64

    for (let i = 0; i < receiptBytes.length; i += CHUNK_SIZE) {
      const chunk = receiptBytes.slice(i, i + CHUNK_SIZE)
      try {
        await characteristic.writeValue(chunk)
        // Mandatory delay to let the physical printer burn the thermal line
        await new Promise((resolve) => setTimeout(resolve, 20))
      } catch (writeErr) {
        console.error('GATT Write error at chunk', i, writeErr)
        throw new Error(
          `Failed writing to printer at byte ${i}. Connection may have dropped.`
        )
      }
    }

    // Wait a moment for the printer to finish processing/printing before disconnecting
    await new Promise((resolve) => setTimeout(resolve, 500))
    // DO NOT disconnect here so we can reuse the connection for the next print!
    toast.success('Receipt printed successfully.')
  } catch (error: unknown) {
    console.error('Bluetooth Print Error:', error)
    const err = error as Error
    toast.error(
      err?.message?.includes('User cancelled')
        ? 'Printing cancelled.'
        : `Print Error: ${err?.message || 'Check printer connection.'}`
    )
  }
}

// export const handleUsbPrint = async (
//   receiptRef: React.RefObject<HTMLDivElement>
// ) => {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const usb = (navigator as any).usb

//   if (!usb) {
//     toast.error('USB printing is not supported on this browser or device.')
//     return
//   }

//   try {
//     // 1. Capture HTML to Image (High Resolution)
//     if (!receiptRef.current) throw new Error('Receipt DOM element not found')
//     const htmlToImage = await import('html-to-image')
//     const printScale = 576 / receiptRef.current.offsetWidth
//     const canvas = await htmlToImage.toCanvas(receiptRef.current, {
//       pixelRatio: printScale,
//       backgroundColor: '#ffffff',
//     })

//     // 2. Connect to Printer via OTG USB
//     const device = await usb.requestDevice({ filters: [] })
//     await device.open()

//     if (device.configuration === null) {
//       await device.selectConfiguration(1)
//     }
//     // Usually printers run on interface 0
//     const iface = device.configuration.interfaces[0]
//     await device.claimInterface(iface.interfaceNumber)

//     // Find bulk OUT endpoint
//     const outEndpoint = iface.alternates[0].endpoints.find(
//       // @ts-expect-error WebUSB types are not fully standardized in DOM lib yet
//       (e) => e.direction === 'out'
//     )
//     if (!outEndpoint) throw new Error('No OUT endpoint found on USB device')

//     // 3. Convert and Transfer
//     // USB pushes data at 480Mbps, so we DO NOT chunk it!
//     const receiptBytes = generateReceiptBlobFromCanvas(canvas)
//     await device.transferOut(outEndpoint.endpointNumber, receiptBytes)

//     toast.success('High-Res receipt printed instantly via USB.')
//   } catch (error: unknown) {
//     console.error('USB Print Error:', error)
//     const err = error as Error
//     toast.error(
//       err?.message?.includes('No device selected')
//         ? 'USB Printing cancelled.'
//         : `USB Error: ${err?.message}`
//     )
//   }
// }
