import { Injectable } from "@nestjs/common";
import { WalletRepository } from "../../infrastructure/repositories/wallet.repository";

@Injectable()
export class UpdateBalanceUseCase {
  constructor(private readonly walletRepository: WalletRepository) {}

  async execute(userEmail: string, amount: number) {
    await this.walletRepository.updateWalletBalance(userEmail, amount);
  }
}
