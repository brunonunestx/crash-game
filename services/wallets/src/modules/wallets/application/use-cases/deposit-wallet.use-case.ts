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
    console.log(`Depositando ${amount} na carteira do usuário ${userEmail}`);
    const currentBalance =
      await this.walletRepository.getWalletBalance(userEmail);

    await this.createLedger.execute({
      userEmail,
      amount,
      type: TransactionType.DEPOSIT,
    });

    await this.walletRepository.updateWalletBalance(
      userEmail,
      currentBalance + amount,
    );
  }
}
