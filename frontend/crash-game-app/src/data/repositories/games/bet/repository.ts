import type { ICreateBetInput } from '@crash-game/types'
import { BaseRepository } from '../base.repository'

export class BetRepository extends BaseRepository {
  constructor() {
    super('/bet')
  }

  createBet(payload: ICreateBetInput) {
    return this.http.post('/', payload)
  }
}
