import { Body, Controller, Get, Param, Post, Query, Req } from "@nestjs/common";
import { CreateBet } from "../../application/use-cases/create-bet.use-case";

type AuthRequest = { user: { payload: { email: string } } };
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
  createBet(@Req() req: AuthRequest, @Body() payload: CreateBetDto) {
    return this.createBetUseCase.execute({
      ...payload,
      userEmail: req.user.payload.email,
    });
  }

  @Authenticated()
  @Post("cancel")
  cancelBet(@Req() req: AuthRequest) {
    return this.cancelBetUseCase.execute({
      userEmail: req.user.payload.email,
    });
  }

  @Authenticated()
  @Post("cashout")
  cashOut(@Req() req: AuthRequest) {
    return this.cashoutBetUseCase.execute({
      userEmail: req.user.payload.email,
    });
  }

  @Authenticated()
  @Get("me")
  getMyBets(
    @Req() req: AuthRequest,
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
