import { WalletRepository } from './wallet/repository'
import { LedgerRepository } from './ledger/repository'

export const walletsRepository = {
  wallet: new WalletRepository(),
  ledger: new LedgerRepository(),
}
