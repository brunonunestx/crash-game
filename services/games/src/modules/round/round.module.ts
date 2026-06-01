import { forwardRef, Module } from "@nestjs/common";
import { RoundEngine } from "./application/engine/round.engine";
import { RunRound } from "./application/use-cases/run-round.use-case";
import { RoundGateway } from "./presentation/gateways/round.gateway";
import { RoundRepository } from "./infrastructure/repositories/round.repository";
import { RoundController } from "./presentation/controllers/round.controller";
import { GetRound } from "./application/use-cases/get-round.use-case";
import { BetModule } from "../bet/bet.module";
import { FinishRoundUseCase } from "./application/use-cases/finish-round.use-case";
import { GetRoundHistory } from "./application/use-cases/get-round-history.use-case";
import { GetRoundVerify } from "./application/use-cases/get-round-verify.use-case";

@Module({
  imports: [forwardRef(() => BetModule)],
  providers: [
    RoundEngine,
    RunRound,
    GetRound,
    GetRoundHistory,
    GetRoundVerify,
    RoundGateway,
    RoundRepository,
    FinishRoundUseCase,
  ],
  exports: [RoundEngine, RunRound, GetRound],
  controllers: [RoundController],
})
export class RoundModule {}
