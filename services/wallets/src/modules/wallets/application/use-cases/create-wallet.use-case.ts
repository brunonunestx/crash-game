import { Injectable } from "@nestjs/common";
import { Wallet } from "../../domain/entities/wallet.entity";

@Injectable()
export class CreateWalletUseCase {
  async execute(userEmail: string) {
    const wallet = new Wallet({
      owner: userEmail,
      balance: 0,
      status: "ACTIVE",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(wallet);
  }
}
