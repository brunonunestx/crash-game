import { Body, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { CreateBet } from "../../application/use-cases/create-bet.use-case";
import { CreateBetDto } from "../dto/create-bet.dto";
import { Authenticated } from "@/providers/auth/auth.decorator";
import { CancelBet } from "../../application/use-cases/cancel-bet.use-case";
import { CashOutUseCase } from "../../application/use-cases/cash-out.use-case";
import { GetRoundBets } from "../../application/use-cases/get-round-bets.use-case";

@Controller("bet")
export class BetController {
  constructor(
    private readonly createBetUseCase: CreateBet,
    private readonly cancelBetUseCase: CancelBet,
    private readonly cashoutBetUseCase: CashOutUseCase,
    private readonly getRoundBetsUseCase: GetRoundBets,
  ) {}

  @Authenticated()
  @Post()
  createBet(@Req() req: any, @Body() payload: CreateBetDto) {
    const user = req.user;
    return this.createBetUseCase.execute({
      ...payload,
      userEmail: user.payload.email,
    });
  }

  @Authenticated()
  @Post("cancel")
  cancelBet(@Req() req: any) {
    const user = req.user;
    return this.cancelBetUseCase.execute({
      userEmail: user.payload.email,
    });
  }

  @Authenticated()
  @Post("cashout")
  cashOut(@Req() req: any) {
    const user = req.user;
    return this.cashoutBetUseCase.execute({
      userEmail: user.payload.email,
    });
  }

  @Get("round/:roundId")
  getRoundBets(@Param("roundId") roundId: string) {
    return this.getRoundBetsUseCase.execute({ roundId });
  }
}
