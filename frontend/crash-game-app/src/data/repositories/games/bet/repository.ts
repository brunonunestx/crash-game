import type { ICashoutResponse, ICreateBetInput } from '@crash-game/types'
import { doubleToCents } from '@crash-game/utils'
import { BaseRepository } from '../base.repository'

export type RoundBetItem = {
  id: string
  userEmail: string
  amount: number
  cashoutAt: number | null
  status: 'ACTIVE' | 'CASHED_OUT' | 'LOST' | 'CANCELED'
}

export class BetRepository extends BaseRepository {
  constructor() {
    super('/bet')
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
}
