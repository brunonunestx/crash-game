import { BadRequestException, Injectable } from "@nestjs/common";
import { WalletRepository } from "../../infrastructure/repositories/wallet.repository";
import { CreateLedgerItemUseCase } from "@/modules/ledger/application/use-cases/create-ledger.use-case";
import { TransactionType } from "generated/prisma/enums";

@Injectable()
export class WithdrawWalletUseCase {
  constructor(
    private readonly walletRepository: WalletRepository,
    private readonly createLedger: CreateLedgerItemUseCase,
  ) {}

  async execute(userEmail: string, amount: number): Promise<void> {
    const currentBalance =
      await this.walletRepository.getWalletBalance(userEmail);

    if (currentBalance < amount) {
      throw new BadRequestException("Saldo insuficiente");
    }

    await this.createLedger.execute({
      userEmail,
      amount,
      type: TransactionType.WITHDRAW,
    });

    await this.walletRepository.updateWalletBalance(
      userEmail,
      currentBalance - amount,
    );
  }
}
