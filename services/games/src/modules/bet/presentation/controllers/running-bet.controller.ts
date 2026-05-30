import { Body, Controller, Post } from "@nestjs/common";
import { CreateBet } from "../../application/use-cases/create-bet.use-case";
import { CreateBetDto } from "../dto/create-bet.dto";

@Controller("bet")
export class BetController {
  constructor(private readonly createBetUseCase: CreateBet) {}

  @Post()
  createBet(@Body() payload: CreateBetDto) {
    return this.createBetUseCase.execute(payload);
  }
}
