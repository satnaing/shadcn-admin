import { format } from 'date-fns'
import { type Order } from '@/types/api'
import {
  COMMANDS,
  createESCPOSBuffer,
  encodeText,
  GS,
  generateQRCode,
} from '@/lib/escpos'

export const WIDTH_80MM_DOTS = 576 // 80mm printers usually have 576 dots per line

/**
 * Generates raw ESC/POS text commands for instant printing.
 * Note: Pure text commands may have limited/garbled support for Khmer Unicode
 * depending on the printer's hardware font ROM.
 */
export const generateReceiptBlob = (order: Order): Uint8Array => {
  const commands: (number[] | Uint8Array)[] = []

  // Initialize
  commands.push(COMMANDS.INIT)

  // Header
  commands.push(COMMANDS.ALIGN_CENTER)

  // NOTE: Uncomment below to print a logo pre-flashed to NV RAM (ID 1) on a Windows PC.
  commands.push(COMMANDS.PRINT_NV_LOGO)

  commands.push(COMMANDS.TEXT_BOLD_ON)
  commands.push(COMMANDS.TEXT_DOUBLE_HEIGHT)
  commands.push(COMMANDS.TEXT_DOUBLE_WIDTH)
  commands.push(encodeText('YOK'))
  commands.push(COMMANDS.TEXT_NORMAL)
  commands.push(COMMANDS.TEXT_BOLD_OFF)
  commands.push(COMMANDS.LF)

  // Custom ESC/POS inverted color commands
  const INVERT_ON = [0x1d, 0x42, 0x01]
  const INVERT_OFF = [0x1d, 0x42, 0x00]

  // Order Info
  commands.push(COMMANDS.ALIGN_LEFT)

  // Tag: Locker: B6 (Inverted Background)
  commands.push(INVERT_ON)
  commands.push(COMMANDS.TEXT_BOLD_ON)
  commands.push(encodeText(` Locker: B6 `))
  commands.push(INVERT_OFF)
  commands.push(COMMANDS.TEXT_BOLD_OFF)

  // Right aligned order number
  commands.push(encodeText(`    ORDER: YOK-${order.invoiceCode}\n`))

  commands.push(COMMANDS.ALIGN_RIGHT)
  commands.push(
    encodeText(
      format(new Date(order.createdAt), 'E - dd/MM/yyyy _ hh:mma') + '\n'
    )
  )
  commands.push(COMMANDS.LF)

  commands.push(COMMANDS.ALIGN_LEFT)
  commands.push(
    encodeText('- - - - - - - - - - - - - - - - - - - - - - - - \n')
  ) // Dotted visual divider

  // Items
  for (const item of order.items) {
    const nameStr = item.name['en'] ?? ''
    const totalStr = `USD ${(item.unitPrice * item.quantity).toFixed(2)}`

    // Line 1: Name (bold) + right-aligned total on the same 48-char line
    const namePad = Math.max(0, 48 - nameStr.length - totalStr.length)
    commands.push(COMMANDS.TEXT_BOLD_ON)
    commands.push(encodeText(nameStr + ' '.repeat(namePad) + totalStr + '\n'))
    commands.push(COMMANDS.TEXT_BOLD_OFF)

    // Options (if any)
    for (const opt of item.options ?? []) {
      const optLabel = opt.name?.en ?? ''
      const optQty = opt.quantity > 1 ? `${opt.quantity}x ` : ''
      commands.push(encodeText(`  + ${optQty}${optLabel}\n`))
    }

    commands.push(COMMANDS.LF)
  }

  // Divider
  commands.push(
    encodeText('- - - - - - - - - - - - - - - - - - - - - - - - \n')
  )
  commands.push(COMMANDS.LF)

  // Total
  const totalLeft = 'TOTAL PRICE   '
  const totalRight = ` USD ${order.pricing.grandTotal.toFixed(2)} `

  // Standard 80mm width is 48 chars in normal size.
  // In Double Width, it fits 24 chars.
  const totalPad = Math.max(0, 24 - totalLeft.length - totalRight.length)

  commands.push(COMMANDS.TEXT_BOLD_ON)
  commands.push(COMMANDS.TEXT_DOUBLE_HEIGHT)
  commands.push(COMMANDS.TEXT_DOUBLE_WIDTH)

  commands.push(encodeText(totalLeft + ' '.repeat(totalPad)))
  commands.push(INVERT_ON)
  commands.push(encodeText(totalRight))
  commands.push(INVERT_OFF)
  commands.push(encodeText('\n'))

  commands.push(COMMANDS.TEXT_NORMAL)
  commands.push(COMMANDS.TEXT_BOLD_OFF)
  commands.push(COMMANDS.LF)
  commands.push(
    encodeText('- - - - - - - - - - - - - - - - - - - - - - - - \n')
  )

  // Footer
  commands.push(COMMANDS.ALIGN_CENTER)
  commands.push(encodeText('-'.repeat(48) + '\n'))

  // Print a native QR Code (Instant hardware generation)
  commands.push(...generateQRCode('https://yokcafe.com'))

  commands.push(COMMANDS.LF)
  commands.push(encodeText("Follow YOK's Social Media\n"))
  commands.push(encodeText('FB: YOK Cafe | IG: YOK_Cafe | TT: YOK_Cafe\n'))
  commands.push(COMMANDS.LF)
  commands.push(COMMANDS.LF)

  // Cut Paper
  commands.push(COMMANDS.FEED_AND_CUT)

  return createESCPOSBuffer(commands)
}

/**
 * Converts an HTML Canvas containing the receipt design into
 * an ESC/POS GS v 0 raster bit image buffer.
 */
export const generateReceiptBlobFromCanvas = (
  canvas: HTMLCanvasElement
): Uint8Array => {
  const commands: (number[] | Uint8Array)[] = []

  // Initialize and Reset
  commands.push(COMMANDS.INIT)

  // --- IMAGE PROCESSING ---
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not get canvas context')

  // ESC/POS raster images must have a width that is a multiple of 8
  const width = Math.min(canvas.width, WIDTH_80MM_DOTS)
  const widthBytes = Math.ceil(width / 8)
  const height = canvas.height

  const imageData = ctx.getImageData(0, 0, width, height)
  const pixels = imageData.data

  const m = 0
  const xL = widthBytes & 0xff
  const xH = (widthBytes >> 8) & 0xff
  const yL = height & 0xff
  const yH = (height >> 8) & 0xff

  commands.push([GS, 0x76, 0x30, m, xL, xH, yL, yH])

  // Process pixels row by row, packing 8 pixels into 1 byte
  const imageBuffer = new Uint8Array(widthBytes * height)
  let bufferIndex = 0

  for (let y = 0; y < height; y++) {
    for (let xBytes = 0; xBytes < widthBytes; xBytes++) {
      let byte = 0
      for (let bit = 0; bit < 8; bit++) {
        const x = xBytes * 8 + bit
        if (x < width) {
          const idx = (y * width + x) * 4
          const r = pixels[idx]
          const g = pixels[idx + 1]
          const b = pixels[idx + 2]
          const a = pixels[idx + 3]

          const luminance = 0.299 * r + 0.587 * g + 0.114 * b
          const isDark = a > 128 && luminance < 128

          if (isDark) {
            byte |= 1 << (7 - bit)
          }
        }
      }
      imageBuffer[bufferIndex++] = byte
    }
  }

  commands.push(imageBuffer)

  // Cut Paper
  commands.push(COMMANDS.FEED_AND_CUT)

  return createESCPOSBuffer(commands)
}
