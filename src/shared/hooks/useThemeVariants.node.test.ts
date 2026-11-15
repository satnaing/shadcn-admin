import { describe, expect, it } from 'vitest'
import { showVariantSelect } from './useThemeVariants'

describe('showVariantSelect', () => {
  it('hides the selector for 0 or 1 variant, shows it for 2+', () => {
    expect(showVariantSelect(undefined)).toBe(false)
    expect(showVariantSelect([])).toBe(false)
    expect(showVariantSelect(['default'])).toBe(false)
    expect(showVariantSelect(['default', 'minimal'])).toBe(true)
  })
})
