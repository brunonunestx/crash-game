import { BaseRepository } from '../base.repository'

export type RoundHistoryItem = {
  id: string
  breakPoint: number
}

export type RoundVerifyData = {
  roundId: string
  nounce: number
  seed: string
  hashedSeed: string
  breakPoint: number
}

export class RoundRepository extends BaseRepository {
  constructor() {
    super('/rounds')
  }

  async getHistory(page: number, limit: number): Promise<RoundHistoryItem[]> {
    const response = await this.http.get<RoundHistoryItem[]>('/history', {
      params: { page, limit },
    })
    return response.data
  }

  async getVerifyData(roundId: string): Promise<RoundVerifyData> {
    const response = await this.http.get<RoundVerifyData>(`/${roundId}/verify`)
    return response.data
  }
}
