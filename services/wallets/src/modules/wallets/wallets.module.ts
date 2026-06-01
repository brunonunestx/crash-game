import { Module } from "@nestjs/common";
import { CreateWalletUseCase } from "./application/use-cases/create-wallet.use-case";

@Module({
  imports: [],
  controllers: [],
  providers: [CreateWalletUseCase],
})
export class WalletsModule {}
