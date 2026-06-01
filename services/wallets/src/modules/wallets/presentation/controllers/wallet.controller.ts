import { Controller, Get, Post, Req } from "@nestjs/common";
import { CreateWalletUseCase } from "../../application/use-cases/create-wallet.use-case";
import { Authenticated } from "@/providers/auth/auth.decorator";
import { GetWalletUseCase } from "../../application/use-cases/get-wallet.use-case";

@Controller("wallets")
export class WalletController {
  constructor(
    private readonly createWalletUseCase: CreateWalletUseCase,
    private readonly getWalletUseCase: GetWalletUseCase,
  ) {}

  @Authenticated()
  @Post()
  async createWallet(@Req() request: any) {
    await this.createWalletUseCase.execute(request.user.email);
  }

  @Authenticated()
  @Get()
  async getWallet(@Req() request: any) {
    return this.getWalletUseCase.execute(request.user.email);
  }
}
