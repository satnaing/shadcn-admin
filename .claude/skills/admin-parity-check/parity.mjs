// AEC-SIDEBAR-MENU.md -> hansı yarpaq ekranın statusu yoxdur? Çıxış kiçikdir (token qənaəti).
// İstifadə: node .claude/skills/admin-parity-check/parity.mjs [admin|seller|courier|all]
import { readFileSync } from 'node:fs'

const MARK = /^[-\s]*(✅|⏭|⊘|🔄)\s/
const SECTION = { admin: '## 1.', seller: '## 2.', courier: '## 3.' }
const lines = readFileSync('AEC-SIDEBAR-MENU.md', 'utf8').split(/\r?\n/)
const want = process.argv[2] ?? 'all'

let panel = null
const stat = {}
for (const raw of lines) {
  const hit = Object.entries(SECTION).find(([, h]) => raw.startsWith(h))
  if (hit) panel = hit[0]
  else if (raw.startsWith('## ')) panel = null
  if (!panel || (want !== 'all' && want !== panel)) continue

  const m = raw.match(/^(\s*)- (?:(✅|⏭|⊘|🔄) )?\*\*(.+?)\*\* · `([^`]+)`/)
  if (!m || m[4] === '—') continue // qrup başlığı yarpaq deyil
  const [, , mark, name, route] = m
  const s = (stat[panel] ??= { ok: 0, defer: 0, skip: 0, wip: 0, todo: [] })
  if (mark === '✅') s.ok++
  else if (mark === '⏭') s.defer++
  else if (mark === '⊘') s.skip++
  else if (mark === '🔄') s.wip++
  else s.todo.push(`${name} · ${route}`)
}

for (const [p, s] of Object.entries(stat)) {
  const total = s.ok + s.defer + s.skip + s.wip + s.todo.length
  console.log(`\n[${p}] ${total} yarpaq · ✅${s.ok} ⏭${s.defer} ⊘${s.skip} 🔄${s.wip} · STATUSSUZ ${s.todo.length}`)
  s.todo.slice(0, 60).forEach((t) => console.log(`  - ${t}`))
  if (s.todo.length > 60) console.log(`  … +${s.todo.length - 60}`)
}
process.exitCode = Object.values(stat).some((s) => s.todo.length) ? 1 : 0
void MARK
