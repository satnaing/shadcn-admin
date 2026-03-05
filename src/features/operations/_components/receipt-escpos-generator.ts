import { format } from 'date-fns'
import { type ReceiptProps } from '@/types/api'
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
  receiptOrder: ReceiptProps,
  _shopName: string = 'Branch: YOK Sonthormuk',
  khrRate: number = 4100
): Uint8Array => {
  console.log({ receiptOrder })
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
  // commands.push(COMMANDS.LF)

  const orderLabel = `ORDER : YOK-${receiptOrder.invoiceCode}`
  const dateStr = format(
    new Date(receiptOrder.createdAt),
    'dd/MM/yyyy _ hh:mma'
  )
  commands.push(encodeText(createTwoColumns(orderLabel, dateStr, 48) + '\n\n'))
  const formattedQueue = String(receiptOrder.queueNumber || 0).padStart(2, '0')

  // ─── Order Info (two-column) ───
  commands.push(encodeText(DOTS))
  commands.push(COMMANDS.ALIGN_CENTER)
  commands.push(COMMANDS.TEXT_DOUBLE_SIZE)
  commands.push(COMMANDS.TEXT_BOLD_ON)
  commands.push(encodeText(`\n${formattedQueue}\n\n`))
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
  for (const item of receiptOrder.items) {
    const rawItemName = item.name

    const itemNameStr =
      typeof rawItemName === 'string'
        ? rawItemName
        : ((rawItemName as Record<string, string>)?.['en'] ?? '')

    // Kitchen Chits don't strictly need precise unit prices
    const unitPriceStr = `$${Number(item.unitPrice).toFixed(2)}`
    const qtyStr = String(item.quantity)
    const discountStr = '0.00'
    const totalStr = `$${Number(item.totalPrice).toFixed(2)}`

    // Right-side columns string (Unit Price + QTY + Discount + Total)
    const rightCols =
      padRight(unitPriceStr, 8) +
      padRight(qtyStr, 5) +
      padRight(discountStr, 8) +
      totalStr

    // Line 1: Bold item name (left 22 chars) + right columns
    commands.push(COMMANDS.TEXT_BOLD_ON)
    commands.push(encodeText(padRight(itemNameStr, 22) + rightCols + '\n'))
    commands.push(COMMANDS.TEXT_BOLD_OFF)

    // // Line 2: Variant label (e.g. "Sweet 50%") — normal weight
    // if (variantStr) {
    //   commands.push(encodeText(variantStr + '\n'))
    // }

    // Extra modifier/addon options (skip first which is the variant)
    const addonOpts = item.options ?? []
    let optStr = ''
    for (const opt of addonOpts) {
      const rawOptName = opt.name as unknown
      const optLabel =
        typeof rawOptName === 'string'
          ? rawOptName
          : ((rawOptName as Record<string, string>)?.['en'] ?? '')

      // const optPrice = opt.unitPrice ? ` (+$${opt.unitPrice.toFixed(2)})` : ''
      const optQty = opt.quantity > 1 ? `${opt.quantity}x ` : ''
      // optStr += `${optQty}${optLabel}${optPrice} `
      optStr += `${optQty}${optLabel} `
    }

    if (optStr) {
      commands.push(encodeText(`${optStr.trim()}\n`))
    }

    // if (item.instructions) {
    //   commands.push(encodeText(`  Note: ${item.instructions}\n`))
    // }

    commands.push(COMMANDS.LF)
  }

  // ─── Dotted Divider ───
  commands.push(encodeText(DOTS))

  // ─── Financials ───
  if (receiptOrder.subtotal !== undefined) {
    commands.push(COMMANDS.ALIGN_RIGHT)
    commands.push(
      encodeText(
        createTwoColumns(
          'Subtotal',
          `$${Number(receiptOrder.subtotal).toFixed(2)}`,
          48
        ) + '\n'
      )
    )

    // if (receiptOrder.discount && receiptOrder.discount > 0) {
    commands.push(
      encodeText(
        createTwoColumns(
          'Discount',
          receiptOrder.discount
            ? `-$${Number(receiptOrder.discount).toFixed(2)}`
            : '$0.00',
          48
        ) + '\n'
      )
    )
    // }

    if (receiptOrder.total !== undefined) {
      commands.push(COMMANDS.TEXT_BOLD_ON)
      commands.push(
        encodeText(
          createTwoColumns(
            'Total',
            `$${Number(receiptOrder.total).toFixed(2)}`,
            48
          ) + '\n'
        )
      )
      commands.push(COMMANDS.TEXT_BOLD_OFF)
    }

    // ─── Dotted Divider ───
    commands.push(encodeText(DOTS))
  }

  commands.push(COMMANDS.ALIGN_LEFT)

  if (receiptOrder.paymentMethodName) {
    const status = receiptOrder.paymentStatus
      ? ` (${receiptOrder.paymentStatus})`
      : ''
    commands.push(
      encodeText(`Payment: ${receiptOrder.paymentMethodName}${status}\n`)
    )

    // ─── Dotted Divider ───
    commands.push(encodeText(DOTS))
  }

  // Kitchen Chits derived from KdsOrder do not have pricing data
  commands.push(
    encodeText(
      createTwoColumns(
        'TYPE',
        receiptOrder.fulfillmentCategory || 'TAKEAWAY',
        48
      ) + '\n'
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
