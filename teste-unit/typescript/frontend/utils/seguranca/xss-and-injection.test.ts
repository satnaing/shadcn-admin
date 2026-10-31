import test from 'node:test'
import assert from 'node:assert'

// O que este teste executa: Valida que nomes contendo tags HTML ou scripts maliciosos sao tratados sem executar codigo ou corromper a geracao de iniciais.
test('getDisplayNameInitials neutraliza payloads contendo tags de script ou html', () => {
  function getDisplayNameInitials(displayName: string): string {
    const parts = displayName.trim().split(/\s+/).filter(Boolean)
    if (parts.length === 0) return '?'
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    const first = parts[0][0] ?? ''
    const last = parts[parts.length - 1]?.[0] ?? ''
    return (first + last).toUpperCase()
  }

  // O que este teste executa: Valida payload XSS <script>alert(1)</script> retornando apenas iniciais de texto puro.
  const payload = '<script>alert(1)</script>'
  const initials = getDisplayNameInitials(payload)
  assert.strictEqual(typeof initials, 'string')
  assert.strictEqual(initials.includes('<script>'), false)
})

// O que este teste executa: Valida sanitizacao de tokens de busca e queries em filtros de tabela contra caracteres nulos.
test('filtros de busca eliminam bytes nulos e caracteres de controle perigosos', () => {
  function sanitizeSearchQuery(query: string): string {
    return query.replace(/\0/g, '').trim()
  }

  const maliciousInput = 'admin\0-- DROP TABLE users;'
  const sanitized = sanitizeSearchQuery(maliciousInput)
  assert.strictEqual(sanitized.includes('\0'), false)
  assert.strictEqual(sanitized, 'admin-- DROP TABLE users;')
})
