import { format } from 'date-fns'
import { type Order } from '@/types/api'
import {
  COMMANDS,
  createESCPOSBuffer,
  createTwoColumns,
  encodeText,
  GS,
  generateQRCode,
  padRight,
} from '@/lib/escpos'

export const WIDTH_80MM_DOTS = 576 // 80mm printers usually have 576 dots per line

/**
 * Generates raw ESC/POS text commands for instant printing.
 * Note: Pure text commands may have limited/garbled support for Khmer Unicode
 * depending on the printer's hardware font ROM.
 */
export const generateReceiptBlob = (
  order: Order,
  shopName: string = 'Branch: YOK Sonthormuk',
  khrRate: number = 4100
): Uint8Array => {
  const commands: (number[] | Uint8Array)[] = []

  // — Helper: dotted divider (48 chars) —
  const DOTS = '-'.repeat(48).trimEnd() + '\n' // ".. .. .. .." style

  // ─── Initialize ───
  commands.push(COMMANDS.INIT)

  // ─── Header: Logo + "YOK" ───
  commands.push(COMMANDS.ALIGN_CENTER)
  commands.push(COMMANDS.PRINT_NV_LOGO)
  // commands.push(COMMANDS.TEXT_BOLD_ON)
  // commands.push(COMMANDS.TEXT_DOUBLE_HEIGHT)
  // commands.push(COMMANDS.TEXT_DOUBLE_WIDTH)
  commands.push(encodeText('\n\n#146, St 132, Terk Laak 1, Toul Kork, PP\n'))
  commands.push(encodeText('Tel: 086 861 255\n'))
  // commands.push(COMMANDS.TEXT_NORMAL)
  // commands.push(COMMANDS.TEXT_BOLD_OFF)
  commands.push(COMMANDS.LF)
  commands.push(COMMANDS.LF)
  // commands.push(COMMANDS.LF)

  const orderLabel = `ORDER : YOK-${order.invoiceCode}`
  const dateStr = format(new Date(order.createdAt), 'dd/MM/yyyy _ hh:mma')
  commands.push(encodeText(createTwoColumns(orderLabel, dateStr, 48) + '\n\n'))
  // ─── Order Info (two-column) ───
  commands.push(encodeText(DOTS))
  commands.push(COMMANDS.ALIGN_CENTER)
  commands.push(COMMANDS.TEXT_DOUBLE_SIZE)
  commands.push(COMMANDS.TEXT_BOLD_ON)
  commands.push(encodeText('\n6 7 8 5\n\n'))
  commands.push(COMMANDS.TEXT_NORMAL)
  commands.push(COMMANDS.TEXT_BOLD_OFF)
  // commands.push(encodeText(DOTS))
  // ─── Dotted Divider ───
  commands.push(encodeText(DOTS))
  commands.push(COMMANDS.ALIGN_LEFT)

  // ─── Column Headers ───
  // Layout (48 chars): Desc(22) UnitPrice(10) QTY(5) Discount(9) Total
  const headerLine =
    padRight('Item', 22) +
    padRight('Price', 8) +
    padRight('QTY', 5) +
    padRight('Dis%', 8) +
    'Total\n'
  commands.push(encodeText(headerLine))

  // ─── Dotted Divider ───
  commands.push(encodeText(DOTS))
  commands.push(COMMANDS.LF)

  // ─── Items ───
  for (const item of order.items) {
    const nameStr = item.name['en'] ?? ''

    // Sugar/variant option (first option)
    // const variantOpt = item.options?.[0]
    // const variantStr = variantOpt ? (variantOpt.name?.['en'] ?? '') : ''

    const unitPriceStr = item.unitPrice.toFixed(2)
    const qtyStr = String(item.quantity)
    // Per-item discount = unitPrice * qty - totalPrice
    const discountAmount = item.unitPrice * item.quantity - item.totalPrice
    const discountStr = discountAmount.toFixed(2)
    const totalStr = item.totalPrice.toFixed(2)

    // Right-side columns string (Unit Price + QTY + Discount + Total)
    const rightCols =
      padRight(unitPriceStr, 8) +
      padRight(qtyStr, 5) +
      padRight(discountStr, 8) +
      totalStr

    // Line 1: Bold item name (left 22 chars) + right columns
    commands.push(COMMANDS.TEXT_BOLD_ON)
    commands.push(encodeText(padRight(nameStr, 22) + rightCols + '\n'))
    commands.push(COMMANDS.TEXT_BOLD_OFF)

    // // Line 2: Variant label (e.g. "Sweet 50%") — normal weight
    // if (variantStr) {
    //   commands.push(encodeText(variantStr + '\n'))
    // }

    // Extra modifier/addon options (skip first which is the variant)
    const addonOpts = item.options ?? []
    let optStr = ''
    for (const opt of addonOpts) {
      const optLabel = opt.name?.['en'] ?? ''
      // const optQty = opt.quantity > 1 ? `${opt.quantity}x ` : ''
      optStr += `${optLabel} `
    }
    commands.push(encodeText(`${optStr}\n`))
    commands.push(COMMANDS.LF)
  }

  // ─── Dotted Divider ───
  commands.push(encodeText(DOTS))
  commands.push(COMMANDS.ALIGN_RIGHT)
  // ─── Sub Total & Coupon (right-aligned, 48-wide two-column) ───
  const subTotalStr = order.pricing.subtotal.toFixed(2)
  commands.push(
    encodeText(createTwoColumns('Sub Total', subTotalStr, 30) + '\n')
  )

  const couponDiscount = order.pricing.discount
  const couponStr = couponDiscount > 0 ? `-${couponDiscount.toFixed(2)}` : '-'
  commands.push(encodeText(createTwoColumns('Coupon', couponStr, 30) + '\n'))

  // ─── GRAND TOTAL (USD) ───
  const grandTotalUSD = order.pricing.grandTotal.toFixed(2)
  commands.push(
    encodeText(
      createTwoColumns('GRAND TOTAL ( USD )', grandTotalUSD, 30) + '\n'
    )
  )

  // ─── GRAND TOTAL (KHR) ───
  const grandTotalKHR = Math.round(
    order.pricing.grandTotal * khrRate
  ).toLocaleString()
  commands.push(
    encodeText(
      createTwoColumns('GRAND TOTAL ( KHR )', grandTotalKHR, 30) + '\n'
    )
  )

  // ─── Dotted Divider ───
  commands.push(encodeText(DOTS))

  // ─── Footer ───
  commands.push(COMMANDS.ALIGN_CENTER)
  commands.push(COMMANDS.LF)
  commands.push(COMMANDS.LF)
  commands.push(COMMANDS.TEXT_BOLD_ON)
  commands.push(encodeText('THANK YOU FOR ORDER!\n'))
  commands.push(COMMANDS.TEXT_BOLD_OFF)
  commands.push(COMMANDS.LF)

  // Print a native QR Code (hardware-accelerated)
  commands.push(...generateQRCode('https://yokcafee.com'))

  commands.push(COMMANDS.LF)
  commands.push(encodeText(`Exchange Rate : ${khrRate}\n`))
  commands.push(COMMANDS.LF)
  commands.push(COMMANDS.LF)

  // ─── Cut Paper ───
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
