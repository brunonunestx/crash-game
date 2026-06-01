import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RoundHistory } from '#/presentation/pages/games/monkey-crash/_components/round-history'
import type { RoundHistoryItem } from '#/data/repositories/games/round/repository'

vi.mock('#/presentation/pages/games/monkey-crash/_components/round-verify-modal', () => ({
  RoundVerifyModal: () => null,
}))

const makeItem = (id: string, breakPoint: number): RoundHistoryItem => ({
  id,
  breakPoint,
})

describe('RoundHistory', () => {
  it('não renderiza nada com histórico vazio', () => {
    const { container } = render(<RoundHistory history={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renderiza um chip por item no histórico', () => {
    const history = [
      makeItem('1', 150),
      makeItem('2', 320),
      makeItem('3', 800),
    ]
    render(<RoundHistory history={history} />)
    expect(screen.getAllByRole('generic').filter(el =>
      el.className.includes('rounded-lg')
    ).length).toBeGreaterThanOrEqual(3)
  })

  it('exibe o multiplicador formatado com 2 casas decimais', () => {
    render(<RoundHistory history={[makeItem('1', 250)]} />)
    expect(screen.getByText('2.50x')).toBeInTheDocument()
  })

  it('aplica cor vermelha para multiplier <= 2x', () => {
    render(<RoundHistory history={[makeItem('1', 150)]} />)
    const chip = screen.getByText('1.50x')
    expect(chip.className).toContain('text-red-400')
  })

  it('aplica cor amarela para multiplier entre 2x e 5x', () => {
    render(<RoundHistory history={[makeItem('1', 350)]} />)
    const chip = screen.getByText('3.50x')
    expect(chip.className).toContain('text-yellow-400')
  })

  it('aplica cor verde para multiplier entre 5x e 10x', () => {
    render(<RoundHistory history={[makeItem('1', 750)]} />)
    const chip = screen.getByText('7.50x')
    expect(chip.className).toContain('text-green-400')
  })

  it('aplica cor roxa para multiplier > 10x', () => {
    render(<RoundHistory history={[makeItem('1', 1500)]} />)
    const chip = screen.getByText('15.00x')
    expect(chip.className).toContain('text-purple-400')
  })

  it('exibe os itens em ordem reversa (mais recente primeiro)', () => {
    const history = [makeItem('1', 100), makeItem('2', 200), makeItem('3', 300)]
    render(<RoundHistory history={history} />)
    const chips = screen.getAllByText(/x$/)
    expect(chips[0].textContent).toBe('3.00x')
    expect(chips[1].textContent).toBe('2.00x')
    expect(chips[2].textContent).toBe('1.00x')
  })
})
