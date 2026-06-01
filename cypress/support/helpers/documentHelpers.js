/**
 * Gera um CPF válido usando o algoritmo Módulo 11.
 * Retorna string com 11 dígitos (sem formatação).
 */
function generateValidCpf() {
  const digits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 9))

  let sum = digits.reduce((acc, d, i) => acc + d * (10 - i), 0)
  let rem = (sum * 10) % 11
  const d1 = rem >= 10 ? 0 : rem
  digits.push(d1)

  sum = digits.reduce((acc, d, i) => acc + d * (11 - i), 0)
  rem = (sum * 10) % 11
  const d2 = rem >= 10 ? 0 : rem
  digits.push(d2)

  return digits.join('')
}

/**
 * Gera um CNPJ válido usando o algoritmo Módulo 11.
 * Retorna string com 14 dígitos (sem formatação).
 */
function generateValidCnpj() {
  const base = [
    ...Array.from({ length: 8 }, () => Math.floor(Math.random() * 9)),
    0, 0, 0, 1,
  ]

  function calcDigit(arr, weights) {
    const sum = arr.reduce((acc, d, i) => acc + d * weights[i], 0)
    const rem = sum % 11
    return rem < 2 ? 0 : 11 - rem
  }

  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

  base.push(calcDigit(base, w1))
  base.push(calcDigit(base, w2))

  return base.join('')
}

/**
 * Retorna um CNPJ sabidamente inválido (todos zeros) para testes negativos.
 */
function getInvalidCnpj(type = 'allZeros') {
  const options = {
    allZeros: '00000000000000',
    allOnes: '11111111111111',
    wrongCheckDigit: '11222333000199',
    tooShort: '1122233300018',
    withLetters: '1122233A000181',
  }
  return options[type] || options.allZeros
}

/**
 * Retorna um CPF sabidamente inválido para testes negativos.
 */
function getInvalidCpf(type = 'allZeros') {
  const options = {
    allZeros: '00000000000',
    allOnes: '11111111111',
    wrongCheckDigit: '52998224726',
  }
  return options[type] || options.allZeros
}

module.exports = { generateValidCpf, generateValidCnpj, getInvalidCnpj, getInvalidCpf }
