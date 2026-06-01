import { Injectable } from "@nestjs/common";
import { Wallet } from "../../domain/entities/wallet.entity";
import { WalletRepository } from "../../infrastructure/repositories/wallet.repository";

@Injectable()
export class CreateWalletUseCase {
  constructor(private readonly walletRepository: WalletRepository) {}
  async execute(userEmail: string) {
    const wallet = new Wallet({
      owner: userEmail,
      balance: 0,
      status: "ACTIVE",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.walletRepository.save(wallet);
  }
}
