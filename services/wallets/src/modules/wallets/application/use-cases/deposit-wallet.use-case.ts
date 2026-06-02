import { Injectable } from "@nestjs/common";
import { WalletRepository } from "../../infrastructure/repositories/wallet.repository";
import { TransactionType } from "generated/prisma/client";
import { CreateLedgerItemUseCase } from "@/modules/ledger/application/use-cases/create-ledger.use-case";

@Injectable()
export class DepositWalletUseCase {
  constructor(
    private readonly walletRepository: WalletRepository,
    private readonly createLedger: CreateLedgerItemUseCase,
  ) {}

  async execute(userEmail: string, amount: number): Promise<void> {
    await this.createLedger.execute({
      userEmail,
      amount,
      type: TransactionType.DEPOSIT,
    });
  }
}
