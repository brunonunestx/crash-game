import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateWalletUseCase } from "../../application/use-cases/create-wallet.use-case";
import { Authenticated } from "@/providers/auth/auth.decorator";
import { GetWalletUseCase } from "../../application/use-cases/get-wallet.use-case";
import { DepositWalletUseCase } from "../../application/use-cases/deposit-wallet.use-case";
import { WithdrawWalletUseCase } from "../../application/use-cases/withdraw-wallet.use-case";
import { GetBalanceDto } from "../dto/get-balance.dto";

@ApiTags("wallets")
@Controller("")
export class WalletController {
  constructor(
    private readonly createWalletUseCase: CreateWalletUseCase,
    private readonly getWalletUseCase: GetWalletUseCase,
    private readonly depositWalletUseCase: DepositWalletUseCase,
    private readonly withdrawWalletUseCase: WithdrawWalletUseCase,
  ) {}

  @Authenticated()
  @Post()
  @ApiOperation({ summary: "Create wallet for authenticated user" })
  @ApiResponse({ status: 201, description: "Wallet created" })
  async createWallet(@Req() request: any) {
    await this.createWalletUseCase.execute(request.user.payload.email);
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
    const balance = await this.getWalletUseCase.execute(
      request.user.payload.email,
    );
    return new GetBalanceDto(balance);
  }

  @Authenticated()
  @Post("/deposit")
  @ApiOperation({ summary: "Deposit amount to authenticated user's wallet" })
  @ApiResponse({ status: 200, description: "Amount deposited" })
  async deposit(@Req() request: any, @Body() body: { amount: number }) {
    await this.depositWalletUseCase.execute(
      request.user.payload.email,
      body.amount,
    );
  }

  @Authenticated()
  @Post("/withdraw")
  @ApiOperation({ summary: "Withdraw amount from authenticated user's wallet" })
  @ApiResponse({ status: 200, description: "Amount withdrawn" })
  async withdraw(@Req() request: any, @Body() body: { amount: number }) {
    await this.withdrawWalletUseCase.execute(
      request.user.payload.email,
      body.amount,
    );
  }
}
