import { centsToDouble } from '@crash-game/utils'
import { BaseRepository } from '../base.repository'

export type LedgerEntryType = 'LOSS' | 'WIN' | 'DEPOSIT' | 'WITHDRAW'

export type LedgerEntry = {
  id: string
  amount: number
  type: LedgerEntryType
  createdAt: string
}

type LedgerEntryRaw = {
  id: string
  amount: number
  type: LedgerEntryType
  createdAt: string
}

export type LedgerPage = {
  ledgerItems: LedgerEntry[]
  currentPage: number
  itemsPerPage: number
  totalPages: number
  totalItems: number
}

type LedgerPageRaw = Omit<LedgerPage, 'ledgerItems'> & {
  ledgerItems: LedgerEntryRaw[]
}

export class LedgerRepository extends BaseRepository {
  constructor() {
    super('/ledger')
  }

  async getHistory(
    userEmail: string,
    page: number,
    limit: number,
    orderBy: 'asc' | 'desc' = 'desc',
  ): Promise<LedgerPage> {
    const response = await this.http.get<LedgerPageRaw>('', {
      params: { userEmail, page, limit, orderBy },
    })
    return {
      ...response.data,
      ledgerItems: response.data.ledgerItems.map((entry) => ({
        ...entry,
        amount: centsToDouble(entry.amount),
      })),
    }
  }
}
