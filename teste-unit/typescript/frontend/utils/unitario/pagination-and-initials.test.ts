import test from 'node:test'
import assert from 'node:assert'

// O que este teste executa: Valida o algoritmo de paginacao numerica com elipses para datasets pequenos, no inicio, meio e fim.
test('getPageNumbers gera intervalos corretos com marcadores de elipse', () => {
  function getPageNumbers(currentPage: number, totalPages: number) {
    const maxVisiblePages = 5
    const rangeWithDots = []

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) rangeWithDots.push(i)
    } else {
      rangeWithDots.push(1)
      if (currentPage <= 3) {
        for (let i = 2; i <= 4; i++) rangeWithDots.push(i)
        rangeWithDots.push('...', totalPages)
      } else if (currentPage >= totalPages - 2) {
        rangeWithDots.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) rangeWithDots.push(i)
      } else {
        rangeWithDots.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) rangeWithDots.push(i)
        rangeWithDots.push('...', totalPages)
      }
    }
    return rangeWithDots
  }

  // O que este teste executa: Valida dataset pequeno (<= 5 paginas) onde todas as paginas devem ser visiveis sem reticencias.
  assert.deepStrictEqual(getPageNumbers(1, 4), [1, 2, 3, 4])

  // O que este teste executa: Valida visualizacao no inicio do dataset (pagina 2 de 10).
  assert.deepStrictEqual(getPageNumbers(2, 10), [1, 2, 3, 4, '...', 10])

  // O que este teste executa: Valida visualizacao central do dataset (pagina 5 de 10).
  assert.deepStrictEqual(getPageNumbers(5, 10), [1, '...', 4, 5, 6, '...', 10])

  // O que este teste executa: Valida visualizacao no fim do dataset (pagina 9 de 10).
  assert.deepStrictEqual(getPageNumbers(9, 10), [1, '...', 7, 8, 9, 10])
})

// O que este teste executa: Valida a extracao de iniciais para avatares a partir de nomes completos, compostos, unicos ou vazios.
test('getDisplayNameInitials extrai iniciais em maiusculas e trata strings nulas/vazias', () => {
  function getDisplayNameInitials(displayName: string): string {
    const parts = displayName.trim().split(/\s+/).filter(Boolean)
    if (parts.length === 0) return '?'
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    const first = parts[0][0] ?? ''
    const last = parts[parts.length - 1]?.[0] ?? ''
    return (first + last).toUpperCase()
  }

  // O que este teste executa: Valida nome composto com primeiro e ultimo sobrenome.
  assert.strictEqual(getDisplayNameInitials('Mauricio Oliveira'), 'MO')

  // O que este teste executa: Valida nome unico pegando as duas primeiras letras.
  assert.strictEqual(getDisplayNameInitials('Admin'), 'AD')

  // O que este teste executa: Valida string vazia ou espacos retornando caracter de interrogacao.
  assert.strictEqual(getDisplayNameInitials('   '), '?')
})
