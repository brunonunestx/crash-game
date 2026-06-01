import { Module } from "@nestjs/common";
import { CreateWalletUseCase } from "./application/use-cases/create-wallet.use-case";
import { GetWalletUseCase } from "./application/use-cases/get-wallet.use-case";
import { WalletController } from "./presentation/controllers/wallet.controller";
import { WalletRepository } from "./infrastructure/repositories/wallet.repository";

@Module({
  imports: [],
  controllers: [WalletController],
  providers: [CreateWalletUseCase, GetWalletUseCase, WalletRepository],
})
export class WalletsModule {}
