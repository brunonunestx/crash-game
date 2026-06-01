import { forwardRef, Module } from "@nestjs/common";
import { CreateWalletUseCase } from "./application/use-cases/create-wallet.use-case";
import { GetWalletUseCase } from "./application/use-cases/get-wallet.use-case";
import { WalletController } from "./presentation/controllers/wallet.controller";
import { WalletRepository } from "./infrastructure/repositories/wallet.repository";
import { DepositWalletUseCase } from "./application/use-cases/deposit-wallet.use-case";
import { WithdrawWalletUseCase } from "./application/use-cases/withdraw-wallet.use-case";
import { LedgerModule } from "../ledger/ledger.module";
import { UpdateBalanceUseCase } from "./application/use-cases/update-balance.use-case";

@Module({
  imports: [forwardRef(() => LedgerModule)],
  controllers: [WalletController],
  providers: [
    CreateWalletUseCase,
    GetWalletUseCase,
    DepositWalletUseCase,
    WithdrawWalletUseCase,
    UpdateBalanceUseCase,
    WalletRepository,
  ],
  exports: [UpdateBalanceUseCase],
})
export class WalletsModule {}
