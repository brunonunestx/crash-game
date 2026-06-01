import { centsToDouble, doubleToCents } from '@crash-game/utils'
import { BaseRepository } from '../base.repository'

export class WalletRepository extends BaseRepository {
  constructor() {
    super('')
  }

  async getWalletBalance(): Promise<number> {
    const response = await this.http.get('/me')
    return centsToDouble(response.data.balance)
  }

  async createWallet(): Promise<void> {
    await this.http.post('')
  }

  async deposit(amount: number): Promise<void> {
    await this.http.post('/deposit', { amount: doubleToCents(amount) })
  }

  async withdraw(amount: number): Promise<void> {
    await this.http.post('/withdraw', { amount: doubleToCents(amount) })
  }
}
