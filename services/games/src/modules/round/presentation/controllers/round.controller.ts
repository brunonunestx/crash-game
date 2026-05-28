import { Controller, Get } from "@nestjs/common";
import { GetRound } from "../../application/use-cases/get-round.use-case";

@Controller("round")
export class RoundController {
  constructor(private readonly getRoundUseCase: GetRound) {}

  @Get("/current")
  getCurrentRound() {
    return this.getRoundUseCase.execute();
  }
}
