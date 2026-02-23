// Global type definition for our cached printer
export {}
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cachedPrinterDevice?: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cachedLabelPrinterDevice?: any
  }
}
