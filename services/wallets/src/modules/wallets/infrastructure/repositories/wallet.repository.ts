import { DatabaseService } from "@/providers/database/database.service";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Wallet } from "../../domain/entities/wallet.entity";

@Injectable()
export class WalletRepository {
  constructor(private readonly database: DatabaseService) {}
  async save(wallet: Wallet): Promise<void> {
    await this.database.wallet.create({
      data: {
        id: wallet.id,
        owner: wallet.owner,
        balance: wallet.balance,
        status: wallet.status.getValue(),
        createdAt: wallet.createdAt,
        updatedAt: wallet.updatedAt,
      },
    });
  }

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

  async findByEmail(userEmail: string): Promise<Wallet | null> {
    const walletData = await this.database.wallet.findUnique({
      where: { owner: userEmail },
    });

    if (!walletData) {
      return null;
    }

    return new Wallet({
      id: walletData.id,
      owner: walletData.owner,
      balance: walletData.balance,
      status: walletData.status,
      createdAt: walletData.createdAt,
      updatedAt: walletData.updatedAt,
    });
  }
}
