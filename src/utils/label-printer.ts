/**
 * Label Printer Utility for Xprinter XP-410B
 * Label Size: 40mm x 25mm
 * Protocol: TSPL (Taiwan Semiconductor Printing Language)
 *
 * The XP-410B uses TSPL, which is completely different from the ESC/POS
 * protocol used by the receipt printer. TSPL commands are plain ASCII strings
 * terminated with \r\n, which makes them simple to construct.
 */
import { toast } from 'sonner'

// --- TSPL Label Data Types ---

export interface LabelData {
  drinkName: string // e.g. "Brown Sugar Latte"
  variant?: string // e.g. "Iced / Less Sugar"
  note?: string // e.g. "No ice"
  orderCode: string // e.g. "YOK-0012"
  quantity?: number // e.g. 2 (for printing multiple copies)
}

// --- TSPL Generator ---

/**
 * Generates a TSPL command string for a 40mm x 25mm label.
 * XP-410B at 203 DPI:
 *   40mm wide = ~320 dots
 *   25mm tall  = ~200 dots
 */
export const generateLabelTSPL = (label: LabelData): string => {
  const copies = label.quantity ?? 1

  // Truncate long names to fit the label width
  const drinkName = label.drinkName.slice(0, 20)
  const variant = (label.variant ?? '').slice(0, 24)
  const note = (label.note ?? '').slice(0, 24)
  const orderCode = label.orderCode.slice(0, 20)

  const lines: string[] = [
    // 1. Set label dimensions (width mm, height mm)
    'SIZE 40 mm, 25 mm',

    // 2. Gap between labels (typical black mark / gap label = 2mm)
    'GAP 2 mm, 0 mm',

    // 3. Set print speed (1–14, lower is slower but more accurate)
    'SPEED 4',

    // 4. Set print darkness (0–15)
    'DENSITY 8',

    // 5. Set print direction (0 = top to bottom)
    'DIRECTION 0',

    // 6. Clear the image buffer before drawing
    'CLS',

    // --- Drawing Layer ---

    // Drink name — large font, bold, top of label
    // TEXT x, y, "font", rotation, x-scale, y-scale, "text"
    // Font "3" = built-in 14pt font (fits ~20 chars on 40mm)
    `TEXT 10, 10, "3", 0, 1, 1, "${drinkName}"`,
  ]

  // Variant/Sugar level line (if present)
  if (variant) {
    lines.push(`TEXT 10, 60, "2", 0, 1, 1, "${variant}"`)
  }

  // Note line (if present)
  if (note) {
    lines.push(`TEXT 10, 90, "2", 0, 1, 1, "* ${note}"`)
  }

  // Horizontal divider line (x1, y1, x2, y2, thickness in dots)
  lines.push('BAR 0, 118, 320, 2')

  // Order Code — small font at the bottom
  // Font "1" = smallest built-in font
  lines.push(`TEXT 10, 125, "1", 0, 1, 1, "${orderCode}"`)

  // Timestamp — right-aligned at the bottom
  const now = new Date()
  const time = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
  lines.push(`TEXT 220, 125, "1", 0, 1, 1, "${time}"`)

  // 7. Print N copies
  lines.push(`PRINT ${copies}`)

  // TSPL commands are separated by \r\n
  return lines.join('\r\n') + '\r\n'
}

// --- Bluetooth Sender ---

/**
 * Connects to the XP-410B label printer via Bluetooth and prints a label.
 * Note: The XP-410B is a CLASSIC Bluetooth (not BLE) device, but Web Bluetooth
 * can connect to it using the generic Serial Port Profile (SPP) service UUID.
 *
 * Common SPP Service UUID:  0x1101  (or full: 00001101-0000-1000-8000-00805f9b34fb)
 */
export const printLabelViaBluetooth = async (label: LabelData) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bluetooth = (navigator as any).bluetooth

  if (!bluetooth) {
    toast.error(
      'Bluetooth is not supported. On iOS, please use the Bluefy or WebBLE app.'
    )
    return
  }

  try {
    // Cache the label printer device separately from the receipt printer
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let device = window.cachedLabelPrinterDevice as any

    if (!device || !device.gatt?.connected) {
      device = await bluetooth.requestDevice({
        filters: [
          { namePrefix: 'XP' },
          { namePrefix: 'XP-410' },
          { namePrefix: 'Printer' },
        ],
        // SPP service for classic BT bridged via BLE
        optionalServices: [
          '000018f0-0000-1000-8000-00805f9b34fb',
          '00001101-0000-1000-8000-00805f9b34fb',
        ],
      })

      window.cachedLabelPrinterDevice = device

      device.addEventListener('gattserverdisconnected', () => {
        window.cachedLabelPrinterDevice = null
      })
    }

    if (!device.gatt)
      throw new Error('Cannot connect to GATT on label printer.')

    // Connect if not already connected
    const server = device.gatt.connected
      ? device.gatt
      : await device.gatt.connect()

    // Try the common ESC/POS service first, then fall back to SPP
    let characteristic
    try {
      const service = await server.getPrimaryService(
        '000018f0-0000-1000-8000-00805f9b34fb'
      )
      characteristic = await service.getCharacteristic(
        '00002af1-0000-1000-8000-00805f9b34fb'
      )
    } catch {
      // Fallback: try SPP service
      const service = await server.getPrimaryService(
        '00001101-0000-1000-8000-00805f9b34fb'
      )
      characteristic = await service.getCharacteristic(
        '00001101-0000-1000-8000-00805f9b34fb'
      )
    }

    // Generate TSPL and encode to bytes
    const tspl = generateLabelTSPL(label)
    const bytes = new TextEncoder().encode(tspl)

    // Send in chunks to avoid MTU limits
    const CHUNK_SIZE = 64
    for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
      const chunk = bytes.slice(i, i + CHUNK_SIZE)
      await characteristic.writeValue(chunk)
      await new Promise((resolve) => setTimeout(resolve, 20))
    }

    toast.success(`Label printed: ${label.drinkName}`)
  } catch (error: unknown) {
    const err = error as Error
    toast.error(
      err?.message?.includes('User cancelled')
        ? 'Label printing cancelled.'
        : `Label Print Error: ${err?.message || 'Check label printer connection.'}`
    )
  }
}
