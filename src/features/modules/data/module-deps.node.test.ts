import { describe, expect, it } from 'vitest'
import { applyPlan, diffState, type DepModule, planToggle } from './module-deps'

const mods: DepModule[] = [
  { id: 'order', required: true, installed: true, requires: [] },
  { id: 'pos', required: false, installed: true, requires: [] },
  { id: 'courier', required: false, installed: true, requires: ['pos'] },
  { id: 'refund', required: false, installed: true, requires: ['order'] },
  { id: 'ghost', required: false, installed: false, requires: [] },
  { id: 'needsGhost', required: false, installed: true, requires: ['ghost'] },
]
const state = { order: true, pos: false, courier: false, refund: false, ghost: false, needsGhost: false }

describe('module dependency plan', () => {
  it('locks required modules', () => {
    expect(planToggle(mods, { ...state }, 'order', false).ok).toBe(false)
  })

  it('enabling a module also enables its disabled dependencies', () => {
    const plan = planToggle(mods, state, 'courier', true)
    expect(plan).toEqual({ ok: true, blockedBy: [], also: ['pos'] })
    expect(applyPlan(state, 'courier', true, plan)).toMatchObject({ courier: true, pos: true })
  })

  it('refuses when a dependency is not installed', () => {
    expect(planToggle(mods, state, 'needsGhost', true)).toMatchObject({ ok: false, blockedBy: ['ghost'] })
  })

  it('disabling lists enabled dependants', () => {
    const on = { ...state, pos: true, courier: true }
    expect(planToggle(mods, on, 'pos', false)).toEqual({ ok: true, blockedBy: [], also: ['courier'] })
  })

  it('does not touch dependencies that are already in the target state', () => {
    expect(planToggle(mods, { ...state, pos: true }, 'courier', true).also).toEqual([])
  })

  it('diffs against server state', () => {
    expect(diffState(state, { ...state, pos: true })).toEqual([{ id: 'pos', enabled: true }])
  })
})
