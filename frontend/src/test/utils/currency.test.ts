import { describe, it, expect } from 'vitest'
import { centsToDouble, doubleToCents } from '@crash-game/utils'

describe('centsToDouble', () => {
  it('converte 100 centavos para 1.00', () => {
    expect(centsToDouble(100)).toBe(1)
  })

  it('converte 150 centavos para 1.50', () => {
    expect(centsToDouble(150)).toBe(1.5)
  })

  it('converte 10050 centavos para 100.50', () => {
    expect(centsToDouble(10050)).toBe(100.5)
  })

  it('converte 0 para 0', () => {
    expect(centsToDouble(0)).toBe(0)
  })

  it('preserva precisão monetária sem ponto flutuante espúrio', () => {
    expect(centsToDouble(1)).toBe(0.01)
    expect(centsToDouble(10)).toBe(0.1)
    expect(centsToDouble(999)).toBe(9.99)
  })
})

describe('doubleToCents', () => {
  it('converte 1.00 para 100 centavos', () => {
    expect(doubleToCents(1)).toBe(100)
  })

  it('converte 1.50 para 150 centavos', () => {
    expect(doubleToCents(1.5)).toBe(150)
  })

  it('converte 100.50 para 10050 centavos', () => {
    expect(doubleToCents(100.5)).toBe(10050)
  })

  it('converte 0 para 0', () => {
    expect(doubleToCents(0)).toBe(0)
  })

  it('arredonda metade para cima', () => {
    expect(doubleToCents(1.995)).toBe(200)
    expect(doubleToCents(1.994)).toBe(199)
  })

  it('é inverso de centsToDouble', () => {
    const original = 4250
    expect(doubleToCents(centsToDouble(original))).toBe(original)
  })
})
