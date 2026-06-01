import type { ICashoutResponse, ICreateBetInput } from '@crash-game/types'
import { centsToDouble, doubleToCents } from '@crash-game/utils'
import { BaseRepository } from '../base.repository'

export type RoundBetItem = {
  id: string
  userEmail: string
  amount: number
  cashoutAt: number | null
  status: 'ACTIVE' | 'CASHED_OUT' | 'LOST' | 'CANCELED'
}

export type MyBetItem = {
  id: string
  roundId: string
  roundNumber: number
  amount: number
  cashoutAt: number | null
  status: 'ACTIVE' | 'CASHED_OUT' | 'LOST' | 'CANCELED'
  createdAt: string
}

export type MyBetsPage = {
  bets: MyBetItem[]
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
}

export class BetRepository extends BaseRepository {
  constructor() {
    super('/bets')
  }

  createBet(payload: ICreateBetInput) {
    return this.http.post('/', { amount: doubleToCents(payload.amount) })
  }

  async cashOut(): Promise<ICashoutResponse> {
    const response = await this.http.post<ICashoutResponse>('/cashout')
    return response.data
  }

  cancelBet() {
    return this.http.post('/cancel')
  }

  async getRoundBets(roundId: string): Promise<RoundBetItem[]> {
    const response = await this.http.get<RoundBetItem[]>(`/round/${roundId}`)
    return response.data
  }

  async getMyBets(page: number, limit: number): Promise<MyBetsPage> {
    const response = await this.http.get<MyBetsPage>('/me', {
      params: { page, limit },
    })
    return {
      ...response.data,
      bets: response.data.bets.map((bet) => ({
        ...bet,
        amount: centsToDouble(bet.amount),
        cashoutAt: bet.cashoutAt !== null ? centsToDouble(bet.cashoutAt) : null,
      })),
    }
  }
}
