import { Module } from "@nestjs/common";
import { LedgerRepository } from "./infrastructure/repositories/ledger.repository";
import { CreateLedgerItemUseCase } from "./application/use-cases/create-ledger.use-case";

@Module({
  imports: [],
  controllers: [],
  providers: [LedgerRepository, CreateLedgerItemUseCase],
  exports: [CreateLedgerItemUseCase],
})
export class LedgerModule {}
