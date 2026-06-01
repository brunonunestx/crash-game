import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { GetRound } from "../../application/use-cases/get-round.use-case";
import { GetRoundHistory } from "../../application/use-cases/get-round-history.use-case";
import { GetRoundVerify } from "../../application/use-cases/get-round-verify.use-case";

@Controller("rounds")
export class RoundController {
  constructor(
    private readonly getRoundUseCase: GetRound,
    private readonly getRoundHistoryUseCase: GetRoundHistory,
    private readonly getRoundVerifyUseCase: GetRoundVerify,
  ) {}

  @Get("/current")
  getCurrentRound() {
    return this.getRoundUseCase.execute();
  }

  @Get("/history")
  getRoundHistory(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.getRoundHistoryUseCase.execute({ page, limit });
  }

  @Get("/:roundId/verify")
  getRoundVerify(@Param("roundId") roundId: string) {
    return this.getRoundVerifyUseCase.execute({ roundId });
  }
}
