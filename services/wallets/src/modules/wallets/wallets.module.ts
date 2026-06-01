import { Module } from "@nestjs/common";
import { CreateWalletUseCase } from "./application/use-cases/create-wallet.use-case";
import { GetWalletUseCase } from "./application/use-cases/get-wallet.use-case";
import { WalletController } from "./presentation/controllers/wallet.controller";
import { WalletRepository } from "./infrastructure/repositories/wallet.repository";
import { DepositWalletUseCase } from "./application/use-cases/deposit-wallet.use-case";
import { WithdrawWalletUseCase } from "./application/use-cases/withdraw-wallet.use-case";
import { LedgerModule } from "../ledger/ledger.module";

@Module({
  imports: [LedgerModule],
  controllers: [WalletController],
  providers: [
    CreateWalletUseCase,
    GetWalletUseCase,
    DepositWalletUseCase,
    WithdrawWalletUseCase,
    WalletRepository,
  ],
})
export class WalletsModule {}
