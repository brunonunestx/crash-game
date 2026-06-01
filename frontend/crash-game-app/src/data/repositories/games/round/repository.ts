import { BaseRepository } from '../base.repository'

export type RoundHistoryItem = {
  breakPoint: number
}

export class RoundRepository extends BaseRepository {
  constructor() {
    super('/round')
  }

  async getHistory(page: number, limit: number): Promise<RoundHistoryItem[]> {
    const response = await this.http.get<RoundHistoryItem[]>('/history', {
      params: { page, limit },
    })
    return response.data
  }
}
