import { Module } from "@nestjs/common";
import { BetController } from "./presentation/controllers/running-bet.controller";
import { CreateBet } from "./application/use-cases/create-bet.use-case";
import { AuthModule } from "@/providers/auth/auth.module";
import { BetRepository } from "./infrastructure/repositories/bet.repository";
import { RoundModule } from "../round/round.module";
import { CancelBet } from "./application/use-cases/cancel-bet.use-case";
import { CashOutUseCase } from "./application/use-cases/cash-out.use-case";

@Module({
  imports: [AuthModule, RoundModule],
  controllers: [BetController],
  providers: [CreateBet, CancelBet, CashOutUseCase, BetRepository],
})
export class BetModule {}
