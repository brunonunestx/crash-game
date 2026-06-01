import { Module } from "@nestjs/common";
import { LedgerRepository } from "./infrastructure/repositories/ledger.repository";
import { CreateLedgerItemUseCase } from "./application/use-cases/create-ledger.use-case";
import { WalletsModule } from "../wallets/wallets.module";
import { ListLedgerUseCase } from "./application/use-cases/list-ledger.use-case";
import { LedgerController } from "./presentation/controllers/ledger.controller";

@Module({
  imports: [WalletsModule],
  controllers: [LedgerController],
  providers: [LedgerRepository, CreateLedgerItemUseCase, ListLedgerUseCase],
  exports: [CreateLedgerItemUseCase],
})
export class LedgerModule {}
