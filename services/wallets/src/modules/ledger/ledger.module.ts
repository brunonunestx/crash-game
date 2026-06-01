import { Module } from "@nestjs/common";
import { LedgerRepository } from "./infrastructure/repositories/ledger.repository";
import { CreateLedgerItemUseCase } from "./application/use-cases/create-ledger.use-case";
import { WalletsModule } from "../wallets/wallets.module";

@Module({
  imports: [WalletsModule],
  controllers: [],
  providers: [LedgerRepository, CreateLedgerItemUseCase],
  exports: [CreateLedgerItemUseCase],
})
export class LedgerModule {}
