import { Body, Controller, Get, Param, Post, Query, Req } from "@nestjs/common";
import { CreateBet } from "../../application/use-cases/create-bet.use-case";
import { CreateBetDto } from "../dto/create-bet.dto";
import { Authenticated } from "@/providers/auth/auth.decorator";
import { CancelBet } from "../../application/use-cases/cancel-bet.use-case";
import { CashOutUseCase } from "../../application/use-cases/cash-out.use-case";
import { GetRoundBets } from "../../application/use-cases/get-round-bets.use-case";
import { GetMyBets } from "../../application/use-cases/get-my-bets.use-case";

@Controller("bets")
export class BetController {
  constructor(
    private readonly createBetUseCase: CreateBet,
    private readonly cancelBetUseCase: CancelBet,
    private readonly cashoutBetUseCase: CashOutUseCase,
    private readonly getRoundBetsUseCase: GetRoundBets,
    private readonly getMyBetsUseCase: GetMyBets,
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

  @Authenticated()
  @Get("me")
  getMyBets(
    @Req() req: any,
    @Query("page") page = "1",
    @Query("limit") limit = "20",
  ) {
    return this.getMyBetsUseCase.execute({
      userEmail: req.user.payload.email,
      page: Math.max(1, parseInt(page, 10)),
      limit: Math.min(100, Math.max(1, parseInt(limit, 10))),
    });
  }

  @Get("round/:roundId")
  getRoundBets(@Param("roundId") roundId: string) {
    return this.getRoundBetsUseCase.execute({ roundId });
  }
}
