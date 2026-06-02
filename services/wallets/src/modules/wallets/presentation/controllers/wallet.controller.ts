import { Body, Controller, Get, Post, Query, Req } from "@nestjs/common";

type AuthRequest = { user: { payload: { email: string } } };
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateWalletUseCase } from "../../application/use-cases/create-wallet.use-case";
import { Authenticated } from "@/providers/auth/auth.decorator";
import { GetWalletUseCase } from "../../application/use-cases/get-wallet.use-case";
import { DepositWalletUseCase } from "../../application/use-cases/deposit-wallet.use-case";
import { WithdrawWalletUseCase } from "../../application/use-cases/withdraw-wallet.use-case";
import { GetBalanceDto } from "../dto/get-balance.dto";
import { CanBetDto } from "../dto/can-bet.dto";
import { ValidateBetUseCase } from "../../application/use-cases/validate-bet.use-case";
import { InternalOnly } from "@/providers/auth/auth.decorator";

@ApiTags("wallets")
@Controller("")
export class WalletController {
  constructor(
    private readonly createWalletUseCase: CreateWalletUseCase,
    private readonly getWalletUseCase: GetWalletUseCase,
    private readonly depositWalletUseCase: DepositWalletUseCase,
    private readonly withdrawWalletUseCase: WithdrawWalletUseCase,
    private readonly validateBetUseCase: ValidateBetUseCase,
  ) {}

  @Authenticated()
  @Post()
  @ApiOperation({ summary: "Create wallet for authenticated user" })
  @ApiResponse({ status: 201, description: "Wallet created" })
  async createWallet(@Req() request: AuthRequest) {
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
  async getWallet(@Req() request: AuthRequest) {
    const balance = await this.getWalletUseCase.execute(
      request.user.payload.email,
    );
    return new GetBalanceDto(balance);
  }

  @Authenticated()
  @Post("/deposit")
  @ApiOperation({ summary: "Deposit amount to authenticated user's wallet" })
  @ApiResponse({ status: 200, description: "Amount deposited" })
  async deposit(@Req() request: AuthRequest, @Body() body: { amount: number }) {
    await this.depositWalletUseCase.execute(
      request.user.payload.email,
      body.amount,
    );
  }

  @Authenticated()
  @Post("/withdraw")
  @ApiOperation({ summary: "Withdraw amount from authenticated user's wallet" })
  @ApiResponse({ status: 200, description: "Amount withdrawn" })
  async withdraw(@Req() request: AuthRequest, @Body() body: { amount: number }) {
    await this.withdrawWalletUseCase.execute(
      request.user.payload.email,
      body.amount,
    );
  }

  @InternalOnly()
  @Get("/can-bet")
  @ApiOperation({
    summary: "Check if authenticated user can place a bet",
  })
  @ApiResponse({
    status: 200,
    description: "Indicates if the user can place a bet",
    schema: { type: "boolean" },
  })
  async getBalance(
    @Query("userEmail") userEmail: string,
    @Query("betAmount") betAmount: number,
  ) {
    const canBet = await this.validateBetUseCase.execute(userEmail, betAmount);
    return new CanBetDto(canBet);
  }
}
