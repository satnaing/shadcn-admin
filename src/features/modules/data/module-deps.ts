export interface DepModule {
  id: string
  required: boolean
  installed: boolean
  requires: string[]
}

export type EnabledMap = Record<string, boolean>

export interface TogglePlan {
  ok: boolean
  /** Why the toggle is refused (module ids / 'required'). */
  blockedBy: string[]
  /** Other modules switched together with the target (dependencies on enable, dependants on disable). */
  also: string[]
}

const byId = (modules: DepModule[]) => new Map(modules.map((m) => [m.id, m]))

/** What happens if `id` is switched to `enable` given the current effective state. */
export function planToggle(modules: DepModule[], state: EnabledMap, id: string, enable: boolean): TogglePlan {
  const map = byId(modules)
  const target = map.get(id)
  if (!target || !target.installed) return { ok: false, blockedBy: [id], also: [] }
  if (!enable && target.required) return { ok: false, blockedBy: [id], also: [] }

  const also = new Set<string>()
  const blocked = new Set<string>()
  const seen = new Set<string>([id])

  const walk = (current: string) => {
    const related = enable
      ? (map.get(current)?.requires ?? [])
      : modules.filter((m) => m.requires.includes(current)).map((m) => m.id)

    for (const next of related) {
      const m = map.get(next)
      if (seen.has(next)) continue
      seen.add(next)
      if (!m || !m.installed) blocked.add(next)
      else if (!enable && m.required) blocked.add(next)
      else if (state[next] !== enable) {
        also.add(next)
        walk(next)
      } else if (enable) walk(next)
    }
  }
  walk(id)

  return blocked.size ? { ok: false, blockedBy: [...blocked], also: [] } : { ok: true, blockedBy: [], also: [...also] }
}

export function applyPlan(state: EnabledMap, id: string, enable: boolean, plan: TogglePlan): EnabledMap {
  if (!plan.ok) return state
  const next = { ...state, [id]: enable }
  for (const other of plan.also) next[other] = enable
  return next
}

/** Only entries that differ from the server state. */
export function diffState(server: EnabledMap, local: EnabledMap) {
  return Object.keys(local)
    .filter((id) => local[id] !== server[id])
    .map((id) => ({ id, enabled: local[id] }))
}
