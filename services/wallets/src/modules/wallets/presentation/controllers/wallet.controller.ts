import { Controller, Get, Post, Req } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateWalletUseCase } from "../../application/use-cases/create-wallet.use-case";
import { Authenticated } from "@/providers/auth/auth.decorator";
import { GetWalletUseCase } from "../../application/use-cases/get-wallet.use-case";

@ApiTags("wallets")
@Controller("")
export class WalletController {
  constructor(
    private readonly createWalletUseCase: CreateWalletUseCase,
    private readonly getWalletUseCase: GetWalletUseCase,
  ) {}

  @Authenticated()
  @Post()
  @ApiOperation({ summary: "Create wallet for authenticated user" })
  @ApiResponse({ status: 201, description: "Wallet created" })
  async createWallet(@Req() request: any) {
    await this.createWalletUseCase.execute(request.user.email);
  }

  @Authenticated()
  @Get("/me")
  @ApiOperation({ summary: "Get wallet balance for authenticated user" })
  @ApiResponse({
    status: 200,
    description: "Wallet balance",
    schema: { type: "number" },
  })
  async getWallet(@Req() request: any) {
    return this.getWalletUseCase.execute(request.user.email);
  }
}
