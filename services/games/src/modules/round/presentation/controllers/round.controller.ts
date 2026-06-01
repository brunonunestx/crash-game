import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { GetRound } from "../../application/use-cases/get-round.use-case";
import { GetRoundHistory } from "../../application/use-cases/get-round-history.use-case";

@Controller("round")
export class RoundController {
  constructor(
    private readonly getRoundUseCase: GetRound,
    private readonly getRoundHistoryUseCase: GetRoundHistory,
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
}
