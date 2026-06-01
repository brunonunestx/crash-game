import { DatabaseService } from "@/providers/database/database.service";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class WalletRepository {
  constructor(private readonly database: DatabaseService) {}
  async getWalletBalance(userEmail: string): Promise<number> {
    const wallet = await this.database.wallet.findUnique({
      where: { owner: userEmail },
    });

    if (!wallet) {
      throw new NotFoundException("Wallet not found");
    }

    return wallet.balance;
  }

  async updateWalletBalance(userEmail: string, amount: number): Promise<void> {
    const wallet = await this.database.wallet.findUnique({
      where: { owner: userEmail },
    });

    if (!wallet) {
      throw new NotFoundException("Wallet not found");
    }

    await this.database.wallet.update({
      where: { owner: userEmail },
      data: { balance: amount },
    });
  }
}
