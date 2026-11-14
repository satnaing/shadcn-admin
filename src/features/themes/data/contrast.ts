const channel = (value: number) => {
  const c = value / 255
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

const parse = (hex: string): [number, number, number] | null => {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return null
  const full = m[1].length === 3 ? m[1].replace(/./g, (c) => c + c) : m[1]
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as [number, number, number]
}

export const luminance = (hex: string): number | null => {
  const rgb = parse(hex)
  return rgb ? 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]) : null
}

/** WCAG contrast ratio, `null` when either colour is not a hex value. */
export const contrastRatio = (a: string, b: string): number | null => {
  const la = luminance(a)
  const lb = luminance(b)
  if (la === null || lb === null) return null
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

export const WCAG_AA = 4.5

/** Foreground/background token pairs that must stay readable. */
export const CONTRAST_PAIRS: [string, string][] = [
  ['text', 'bg'],
  ['heading', 'surface'],
  ['muted', 'bg'],
  ['inverse', 'primary'],
  ['inverse', 'dark'],
]

export const failingPairs = (colors: Record<string, string>): { fg: string; bg: string; ratio: number }[] =>
  CONTRAST_PAIRS.flatMap(([fg, bg]) => {
    const ratio = colors[fg] && colors[bg] ? contrastRatio(colors[fg], colors[bg]) : null
    return ratio !== null && ratio < WCAG_AA ? [{ fg, bg, ratio }] : []
  })
