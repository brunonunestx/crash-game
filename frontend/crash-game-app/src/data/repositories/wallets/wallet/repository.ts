import { BaseRepository } from '../base.repository'

export class WalletRepository extends BaseRepository {
  constructor() {
    super('')
  }

  async getWalletBalance(): Promise<number> {
    const response = await this.http.get('/me')
    return response.data.balance
  }

  async createWallet(): Promise<void> {
    await this.http.post('')
  }
}
