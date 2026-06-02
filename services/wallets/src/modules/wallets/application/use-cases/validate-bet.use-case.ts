import { Injectable } from "@nestjs/common";
import { GetWalletUseCase } from "./get-wallet.use-case";

@Injectable()
export class ValidateBetUseCase {
  constructor(private readonly getWalletUseCase: GetWalletUseCase) {}

  async execute(userEmail: string, betAmount: number): Promise<boolean> {
    const balance = await this.getWalletUseCase.execute(userEmail);
    return balance >= betAmount;
  }
}
