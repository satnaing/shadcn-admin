import { useEffect } from 'react'

const RECEIPT_FILTER_PREFIXES = ['XP-58', 'XP-80', 'XP', 'Printer']
const LABEL_FILTER_PREFIXES = ['XP-410', 'XP-410B', 'XP-D4601B']

export function useAutoConnectPrinters() {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bluetooth = (navigator as any).bluetooth
    if (!bluetooth || !bluetooth.getDevices) {
      // Browser doesn't support getDevices() yet, or no Web Bluetooth
      console.log(
        '[AutoConnect] navigator.bluetooth.getDevices is not supported in this browser.'
      )
      return
    }

    const connectWithRetry = async (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      device: any,
      printerType: string,
      retries = 5,
      delayMs = 2000
    ) => {
      // Windows Bluetooth stack bug: getDevices() wakes the radio but it takes a moment to actually see the device.
      // If we connect immediately, it falsely reports "device is no longer in range".
      // Fix 1: Try to force Windows to scan for the device using watchAdvertisements()
      if (typeof device.watchAdvertisements === 'function') {
        try {
          console.log(
            `[AutoConnect] Waking up radio for ${printerType} using watchAdvertisements()...`
          )
          await device.watchAdvertisements()
        } catch (e) {
          console.warn(
            `[AutoConnect] watchAdvertisements not supported or failed:`,
            e
          )
        }
      }

      // Fix 2: Wait slightly before the first connection attempt.
      console.log(
        `[AutoConnect] Waiting ${delayMs}ms before connecting to ${printerType}...`
      )
      await new Promise((resolve) => setTimeout(resolve, delayMs))

      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          console.log(
            `[AutoConnect] Attempting GATT connect for ${printerType} (Attempt ${attempt}/${retries})...`
          )
          // Notify the UI that we are in the process of reconnecting
          window.dispatchEvent(
            new CustomEvent('printer-reconnecting', {
              detail: {
                printerType:
                  printerType === 'label printer' ? 'label' : 'receipt',
              },
            })
          )
          await device.gatt.connect()
          console.log(
            `[AutoConnect] ${printerType} GATT connected successfully`
          )
          return true
        } catch (e: unknown) {
          console.error(
            `[AutoConnect] Failed GATT connect for ${printerType} (Attempt ${attempt}/${retries})`,
            e
          )
          if (attempt === retries) {
            console.error(
              `[AutoConnect] Giving up on ${printerType} after ${retries} attempts.`
            )
            // Notify the UI that auto-connect fully failed so it can prompt the user
            window.dispatchEvent(
              new CustomEvent('printer-connect-failed', {
                detail: {
                  printerType:
                    printerType === 'label printer' ? 'label' : 'receipt',
                },
              })
            )
            return false
          }
          // Exponential backoff
          await new Promise((resolve) => setTimeout(resolve, delayMs * attempt))
        }
      }
      return false
    }

    const connectPrinters = async () => {
      try {
        console.log('[AutoConnect] Fetching permitted Bluetooth devices...')
        const devices = await bluetooth.getDevices()
        console.log(
          `[AutoConnect] Found ${devices?.length || 0} permitted device(s).`,
          devices
        )

        for (const device of devices) {
          console.log(`[AutoConnect] Checking device: "${device.name}"`)
          // Check if this device looks like a label printer first (e.g., XP-410B)
          const isLabel = LABEL_FILTER_PREFIXES.some((prefix) =>
            device.name?.startsWith(prefix)
          )

          // It's a receipt printer if it matches receipt prefixes AND is NOT a label printer
          const isReceipt =
            !isLabel &&
            RECEIPT_FILTER_PREFIXES.some((prefix) =>
              device.name?.startsWith(prefix)
            )

          if (isLabel && !window.cachedLabelPrinterDevice) {
            console.log(
              '[AutoConnect] Auto-connecting to label printer:',
              device.name
            )
            window.cachedLabelPrinterDevice = device

            device.addEventListener('gattserverdisconnected', () => {
              console.log('[AutoConnect] Label printer disconnected')
              window.cachedLabelPrinterDevice = null
            })

            // Attempt silent GATT connection
            if (device.gatt && !device.gatt.connected) {
              await connectWithRetry(device, 'label printer')
            } else {
              console.log(
                '[AutoConnect] Label printer GATT already connected or unavailable'
              )
            }
          } else if (isReceipt && !window.cachedPrinterDevice) {
            console.log(
              '[AutoConnect] Auto-connecting to receipt printer:',
              device.name
            )
            window.cachedPrinterDevice = device

            device.addEventListener('gattserverdisconnected', () => {
              console.log('[AutoConnect] Receipt printer disconnected')
              window.cachedPrinterDevice = null
            })

            // Attempt silent GATT connection
            if (device.gatt && !device.gatt.connected) {
              await connectWithRetry(device, 'receipt printer')
            } else {
              console.log(
                '[AutoConnect] Receipt printer GATT already connected or unavailable'
              )
            }
          }
        }
      } catch (err) {
        console.error('[AutoConnect] Error auto-connecting printers:', err)
      }
    }

    connectPrinters()
  }, [])
}
