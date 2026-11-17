import { describe, expect, it } from 'vitest'
import { isEmptyHtml, isSafeUrl } from './rich-text.logic'

describe('rich text logic', () => {
  it('accepts only safe link targets', () => {
    for (const u of ['https://a.az', 'http://a.az/x', 'mailto:a@b.az', '/page', '#top', 'page.html']) expect(isSafeUrl(u)).toBe(true)
    for (const u of ['javascript:alert(1)', ' JaVa\tScript:1', 'data:text/html;base64,xx', 'vbscript:x']) expect(isSafeUrl(u)).toBe(false)
  })
  it('detects empty editor output', () => {
    expect(isEmptyHtml('')).toBe(true)
    expect(isEmptyHtml('<p></p>')).toBe(true)
    expect(isEmptyHtml('<p>&nbsp; </p><p></p>')).toBe(true)
    expect(isEmptyHtml('<p>x</p>')).toBe(false)
    expect(isEmptyHtml('<p><img src="/a.png"></p>')).toBe(false)
  })
})
