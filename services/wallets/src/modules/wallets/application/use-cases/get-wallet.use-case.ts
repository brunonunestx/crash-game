import { Injectable } from "@nestjs/common";
import { WalletRepository } from "../../infrastructure/repositories/wallet.repository";

@Injectable()
export class GetWalletUseCase {
  constructor(private readonly walletRepository: WalletRepository) {}

  async execute(userEmail: string): Promise<number> {
    return await this.walletRepository.getWalletBalance(userEmail);
  }
}
