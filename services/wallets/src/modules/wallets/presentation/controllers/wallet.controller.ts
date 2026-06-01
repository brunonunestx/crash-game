import { Controller, Post, Req } from "@nestjs/common";
import { CreateWalletUseCase } from "../../application/use-cases/create-wallet.use-case";
import { Authenticated } from "@/providers/auth/auth.decorator";

@Controller("wallets")
export class WalletController {
  constructor(private readonly createWalletUseCase: CreateWalletUseCase) {}

  @Authenticated()
  @Post()
  async createWallet(@Req() request: any) {
    await this.createWalletUseCase.execute(request.user.email);
  }
}
