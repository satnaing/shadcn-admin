import { describe, expect, it } from 'vitest'
import { payloadSummary } from './preview-summary'

describe('payloadSummary', () => {
  it('reads strings, numbers and localized values, skips the rest and caps lines', () => {
    const payload = { a: 'x', n: 2, t: { az: 'salam', en: 'hi' }, list: [1], obj: { en: 'only' }, b: 'y' }
    expect(payloadSummary(payload, 'en', 4)).toEqual(['a: x', 'n: 2', 't: hi', 'obj: only'])
    expect(payloadSummary({ t: { az: 'salam' } }, 'ru')).toEqual(['t: salam'])
  })
})
