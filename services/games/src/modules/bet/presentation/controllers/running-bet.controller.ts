import { Body, Controller, Post, Req } from "@nestjs/common";
import { CreateBet } from "../../application/use-cases/create-bet.use-case";
import { CreateBetDto } from "../dto/create-bet.dto";
import { Authenticated } from "@/providers/auth/auth.decorator";

@Controller("bet")
export class BetController {
  constructor(private readonly createBetUseCase: CreateBet) {}

  @Authenticated()
  @Post()
  createBet(@Req() req: any, @Body() payload: CreateBetDto) {
    const user = req.user;
    console.log("Creating bet for user:", user.sub, "with payload:", payload);
    return this.createBetUseCase.execute({ ...payload, userId: user.sub });
  }
}
