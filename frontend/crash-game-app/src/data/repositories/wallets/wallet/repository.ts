import { BaseRepository } from '../base.repository'

export class Repository extends BaseRepository {
  constructor() {
    super('/wallet')
  }

  async getWalletBalance(userEmail: string): Promise<number> {
    const response = await this.http.get('/balance', {
      params: { userEmail },
    })
    return response.data.balance
  }
}
