import { describe, expect, it } from 'vitest'
import { mockMenus } from '@/mocks/themes.data'
import themesRoutes from '@/mocks/themes.routes'
import { contrastRatio, failingPairs } from './contrast'
import { addChild, makeNode, moveNode, nextNodeId, parentOf, removeNode } from './menu-tree'
import { getPath, keyOf, setPath } from './set-path'
import type { MenuNode } from './themes.type'

const node = (id: string, children: MenuNode[] = []): MenuNode => ({ ...makeNode(id), children })
const ids = (tree: MenuNode[]): string[] => tree.flatMap((n) => [n.id, ...ids(n.children)])

describe('contrast', () => {
  it('computes WCAG ratios', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0)
    expect(contrastRatio('#777', '#fff')).toBeLessThan(4.5)
    expect(contrastRatio('nope', '#fff')).toBeNull()
  })

  it('flags failing token pairs only', () => {
    expect(failingPairs({ text: '#111111', bg: '#ffffff' })).toEqual([])
    expect(failingPairs({ text: '#cccccc', bg: '#ffffff' })).toHaveLength(1)
  })
})

describe('menu tree', () => {
  const tree = [node('a', [node('a1')]), node('b'), node('c', [node('c1')])]

  it('moves a node before another one, across parents', () => {
    expect(ids(moveNode(tree, 'b', 'a1'))).toEqual(['a', 'b', 'a1', 'c', 'c1'])
    expect(ids(moveNode(tree, 'c1', 'a'))).toEqual(['c1', 'a', 'a1', 'b', 'c'])
  })

  it('refuses a third level and self-moves', () => {
    expect(moveNode(tree, 'a', 'c1')).toBe(tree)
    expect(moveNode(tree, 'a', 'a')).toBe(tree)
  })

  it('adds, removes and numbers nodes', () => {
    const added = addChild(tree, 'b', node('b1'))
    expect(parentOf(added, 'b1')).toBe('b')
    expect(ids(removeNode(added, 'a'))).toEqual(['b', 'b1', 'c', 'c1'])
    expect(nextNodeId(tree)).toBe('n2')
  })
})

describe('set-path', () => {
  it('reads and writes nested + array paths immutably', () => {
    const source = { list: [{ href: 'x' }], a: { b: 1 } }
    const next = setPath(source, 'list.0.href', 'y')
    expect(getPath(next, 'list.0.href')).toBe('y')
    expect(source.list[0].href).toBe('x')
    expect(keyOf('utilityLinks.2.label')).toBe('utilityLinks.label')
  })
})

describe('themes mocks', () => {
  const call = (key: string, query: Record<string, string> = {}, params: string[] = []) =>
    (themesRoutes[key] as (ctx: { params: string[]; query: Record<string, string> }) => { data: unknown })({ params, query })

  it('answer with one { data } envelope', () => {
    for (const key of Object.keys(themesRoutes).filter((k) => k.startsWith('GET ') && !k.includes(':'))) {
      const body = call(key)
      expect(Array.isArray(body.data), key).toBe(true)
    }
    for (const block of ['topbar', 'header', 'footer', 'tokens', 'custom-code']) {
      const body = call('GET /admin/themes/settings/:block', {}, [block])
      expect(typeof body.data, block).toBe('object')
      expect((body.data as { data?: unknown }).data, block).toBeUndefined()
    }
  })

  it('banners filter by group and locale', () => {
    const rows = (call('GET /admin/themes/banners', { group: 'trio', locale: 'ru' }).data as { group: string; locales: string[] }[])
    expect(rows.length).toBeGreaterThan(0)
    expect(rows.every((r) => r.group === 'trio' && r.locales.includes('ru'))).toBe(true)
  })

  it('menu fixture has unique node ids', () => {
    const all = mockMenus.flatMap((menu) => ids(menu.items))
    expect(new Set(all).size).toBe(all.length)
  })
})

describe('themes locales', () => {
  const files = import.meta.glob<Record<string, string>>('../../../../public/locales/*/themes.json', {
    eager: true,
    import: 'default',
  })
  const read = (lang: string) => files[`../../../../public/locales/${lang}/themes.json`]
  const az = Object.keys(read('az')).sort()

  it.each(['en', 'tr', 'ru'])('%s has the same keys as az', (lang) => {
    expect(Object.keys(read(lang)).sort()).toEqual(az)
  })
})
