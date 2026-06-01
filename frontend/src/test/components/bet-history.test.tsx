import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BetHistory } from '#/presentation/pages/games/monkey-crash/_components/bet-history'
import type { RoundBetItem } from '#/data/repositories/games/bet/repository'

vi.mock('#/presentation/pages/games/monkey-crash/_components/round-verify-modal', () => ({
  RoundVerifyModal: () => null,
}))

const makeBet = (overrides: Partial<RoundBetItem> = {}): RoundBetItem => ({
  id: 'bet-1',
  userEmail: 'player@example.com',
  amount: 1000,
  cashoutAt: null,
  status: 'ACTIVE',
  ...overrides,
})

describe('BetHistory', () => {
  it('exibe mensagem quando não há apostas', () => {
    render(<BetHistory bets={[]} />)
    expect(screen.getByText('Nenhuma aposta nesta rodada')).toBeInTheDocument()
  })

  it('mascara o email do jogador', () => {
    render(<BetHistory bets={[makeBet({ userEmail: 'johndoe@email.com' })]} />)
    // 'johndoe' tem 7 chars → slice(0,3)='joh' + padEnd(7,'*')='joh****'
    expect(screen.getByText('joh****@email.com')).toBeInTheDocument()
  })

  it('exibe o valor da aposta convertido de centavos', () => {
    render(<BetHistory bets={[makeBet({ amount: 5000 })]} />)
    expect(screen.getByText('R$ 50.00')).toBeInTheDocument()
  })

  it('exibe "Voando..." para apostas ACTIVE', () => {
    render(<BetHistory bets={[makeBet({ status: 'ACTIVE' })]} />)
    expect(screen.getByText('Voando...')).toBeInTheDocument()
  })

  it('exibe o multiplicador para cashout', () => {
    render(<BetHistory bets={[makeBet({ status: 'CASHED_OUT', cashoutAt: 250 })]} />)
    expect(screen.getByText('2.50x')).toBeInTheDocument()
  })

  it('exibe "Crash" para apostas perdidas', () => {
    render(<BetHistory bets={[makeBet({ status: 'LOST' })]} />)
    expect(screen.getByText('Crash')).toBeInTheDocument()
  })

  it('exibe "Cancelado" para apostas canceladas', () => {
    render(<BetHistory bets={[makeBet({ status: 'CANCELED' })]} />)
    expect(screen.getByText('Cancelado')).toBeInTheDocument()
  })

  it('ordena: CASHED_OUT → ACTIVE → LOST → CANCELED', () => {
    const bets: RoundBetItem[] = [
      makeBet({ id: '1', status: 'LOST', userEmail: 'lost@x.com' }),
      makeBet({ id: '2', status: 'CASHED_OUT', cashoutAt: 200, userEmail: 'cash@x.com' }),
      makeBet({ id: '3', status: 'CANCELED', userEmail: 'cancel@x.com' }),
      makeBet({ id: '4', status: 'ACTIVE', userEmail: 'active@x.com' }),
    ]
    render(<BetHistory bets={bets} />)

    const rows = screen.getAllByText(/^[a-z]{3}[@*]/)
    expect(rows[0].textContent).toContain('cas')
    expect(rows[1].textContent).toContain('act')
    expect(rows[2].textContent).toContain('los')
    expect(rows[3].textContent).toContain('can')
  })

  it('renderiza uma linha por aposta', () => {
    const bets = [makeBet({ id: '1' }), makeBet({ id: '2' }), makeBet({ id: '3' })]
    render(<BetHistory bets={bets} />)
    expect(screen.getAllByText('R$ 10.00')).toHaveLength(3)
  })
})
