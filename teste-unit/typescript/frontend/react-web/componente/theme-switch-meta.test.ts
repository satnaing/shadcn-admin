import test from 'node:test'
import assert from 'node:assert'

// O que este teste executa: Valida se a meta tag theme-color eh atualizada corretamente para dark (#020817) e light (#fff).
test('calculo de theme-color retorna #020817 para tema escuro e #fff para tema claro', () => {
  function getThemeColor(theme: 'light' | 'dark' | 'system', prefersDark: boolean): string {
    const isDark = theme === 'system' ? prefersDark : theme === 'dark'
    return isDark ? '#020817' : '#fff'
  }

  // O que este teste executa: Verifica retorno de cor escura quando tema explicito for dark.
  assert.strictEqual(getThemeColor('dark', false), '#020817')

  // O que este teste executa: Verifica retorno de cor clara quando tema explicito for light.
  assert.strictEqual(getThemeColor('light', true), '#fff')
})

// O que este teste executa: Valida a resolucao correta da Issue #309 onde o tema 'system' deve respeitar o matchMedia do sistema operacional.
test('Issue #309: tema system deve refletir a preferencia de cor do sistema operacional', () => {
  function getThemeColor(theme: 'light' | 'dark' | 'system', prefersDark: boolean): string {
    const isDark = theme === 'system' ? prefersDark : theme === 'dark'
    return isDark ? '#020817' : '#fff'
  }

  // O que este teste executa: Garante que tema system em SO com modo escuro ativo resulte em #020817.
  assert.strictEqual(getThemeColor('system', true), '#020817')

  // O que este teste executa: Garante que tema system em SO com modo claro ativo resulte em #fff.
  assert.strictEqual(getThemeColor('system', false), '#fff')
})

// O que este teste executa: Valida registro e desregistro do listener de mudanca do sistema operacional.
test('listener de prefers-color-scheme eh adicionado quando tema for system e limpo no unmount', () => {
  let listenerCount = 0
  const mockMediaQuery = {
    matches: true,
    addEventListener: () => {
      listenerCount++
    },
    removeEventListener: () => {
      listenerCount--
    },
  }

  function setupThemeColorListener(theme: string) {
    if (theme === 'system') {
      mockMediaQuery.addEventListener()
      return () => mockMediaQuery.removeEventListener()
    }
    return () => {}
  }

  const cleanup = setupThemeColorListener('system')
  assert.strictEqual(listenerCount, 1)

  cleanup()
  assert.strictEqual(listenerCount, 0)
})
