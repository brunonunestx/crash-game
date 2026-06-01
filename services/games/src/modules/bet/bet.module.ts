import { Module } from "@nestjs/common";
import { BetController } from "./presentation/controllers/running-bet.controller";
import { CreateBet } from "./application/use-cases/create-bet.use-case";
import { AuthModule } from "@/providers/auth/auth.module";
import { BetRepository } from "./infrastructure/repositories/bet.repository";
import { RoundModule } from "../round/round.module";
import { CancelBet } from "./application/use-cases/cancel-bet.use-case";
import { CashOutUseCase } from "./application/use-cases/cash-out.use-case";
import { FindWinnersUseCase } from "./application/use-cases/find-winners.use-case";
import { CloseOpenedBetsUseCase } from "./application/use-cases/close-opened-bets.use-case";
import { RabbitMQModule } from "@/providers/rabbitmq/rabbitmq.module";

@Module({
  imports: [AuthModule, RoundModule, RabbitMQModule],
  controllers: [BetController],
  providers: [
    CreateBet,
    CancelBet,
    CashOutUseCase,
    FindWinnersUseCase,
    CloseOpenedBetsUseCase,
    BetRepository,
  ],
  exports: [
    CreateBet,
    CancelBet,
    CashOutUseCase,
    FindWinnersUseCase,
    CloseOpenedBetsUseCase,
  ],
})
export class BetModule {}
