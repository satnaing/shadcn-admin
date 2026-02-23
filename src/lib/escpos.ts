// src/lib/escpos.ts

// ESC/POS Command Constants
export const ESC = 0x1b
export const GS = 0x1d

export const COMMANDS = {
  // Initialize printer
  INIT: [ESC, 0x40],

  // Text format
  TEXT_NORMAL: [ESC, 0x21, 0x00],
  TEXT_BOLD_ON: [ESC, 0x45, 0x01],
  TEXT_BOLD_OFF: [ESC, 0x45, 0x00],
  TEXT_DOUBLE_HEIGHT: [ESC, 0x21, 0x10],
  TEXT_DOUBLE_WIDTH: [ESC, 0x21, 0x20],
  TEXT_DOUBLE_SIZE: [ESC, 0x21, 0x30],

  // Alignment
  ALIGN_LEFT: [ESC, 0x61, 0x00],
  ALIGN_CENTER: [ESC, 0x61, 0x01],
  ALIGN_RIGHT: [ESC, 0x61, 0x02],

  // Paper cutting
  CUT_FULL: [GS, 0x56, 0x00],
  CUT_PARTIAL: [GS, 0x56, 0x01],
  FEED_AND_CUT: [GS, 0x56, 0x42, 0x00], // Feeds paper to cutting position then cuts

  // Images
  PRINT_NV_LOGO: [0x1c, 0x70, 0x01, 0x00], // Prints NV Logo #1 in Normal Size

  // Motor Control
  REVERSE_FEED_N: [ESC, 0x6a], // Reverse feeds the paper N dots

  // Spacing
  LF: [0x0a], // Line feed (new line)
}

/**
 * Helper to encode a string into Uint8Array for the printer.
 * Note: For non-English characters (like Khmer or Chinese), a proper
 * codepage or canvas-to-image encoding is usually needed. This uses basic ASCII.
 */
export const encodeText = (text: string): Uint8Array => {
  return new TextEncoder().encode(text)
}

export const createESCPOSBuffer = (
  commands: (number[] | Uint8Array)[]
): Uint8Array => {
  // Calculate total length
  const totalLength = commands.reduce((acc, curr) => acc + curr.length, 0)
  const buffer = new Uint8Array(totalLength)

  let offset = 0
  for (const cmd of commands) {
    if (cmd instanceof Uint8Array) {
      buffer.set(cmd, offset)
      offset += cmd.length
    } else {
      buffer.set(new Uint8Array(cmd), offset)
      offset += cmd.length
    }
  }

  return buffer
}

/**
 * Generates ESC/POS commands to print a QR Code natively.
 * This is incredibly fast as it offloads the QR generation to the printer's hardware.
 */
export const generateQRCode = (url: string): (number[] | Uint8Array)[] => {
  const commands: (number[] | Uint8Array)[] = []

  // Select QR Code Model 2
  commands.push([0x1d, 0x28, 0x6b, 0x04, 0x00, 0x31, 0x41, 0x32, 0x00])

  // Set dot size (1 to 16) - 6 is a good medium size
  commands.push([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x43, 0x06])

  // Set Error Correction Level M (49)
  commands.push([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x45, 0x31])

  // Store the data in the symbol storage area
  const data = encodeText(url)
  const pL = (data.length + 3) % 256
  const pH = Math.floor((data.length + 3) / 256)
  commands.push([0x1d, 0x28, 0x6b, pL, pH, 0x31, 0x50, 0x30])
  commands.push(data)

  // Print the symbol data in the storage area
  commands.push([0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x51, 0x30])

  return commands
}

/**
 * Right-pads a string with spaces to a specific length.
 */
export const padRight = (str: string, length: number): string => {
  return str.length >= length
    ? str.substring(0, length)
    : str.padEnd(length, ' ')
}

/**
 * Left-pads a string with spaces to a specific length.
 */
export const padLeft = (str: string, length: number): string => {
  return str.length >= length
    ? str.substring(0, length)
    : str.padStart(length, ' ')
}

/**
 * Creates a two-column layout (e.g. "Item Name            $10.00")
 * 80mm printers typically fit 48 characters on a line for standard font size.
 */
export const createTwoColumns = (
  left: string,
  right: string,
  totalWidth: number = 48
): string => {
  const spaceNeeded = totalWidth - left.length - right.length
  if (spaceNeeded <= 0) {
    // Truncate left string if too long to fit everything
    const truncatedLeft = left.substring(0, totalWidth - right.length - 1)
    return truncatedLeft + ' ' + right
  }
  return left + ' '.repeat(spaceNeeded) + right
}
