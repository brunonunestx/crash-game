import { Module } from "@nestjs/common";
import { RoundEngine } from "./application/engine/round.engine";
import { RunRound } from "./application/use-cases/run-round.use-case";
import { RoundGateway } from "./presentation/gateways/round.gateway";
import { RoundRepository } from "./infrastructure/repositories/round.repository";
import { RoundController } from "./presentation/controllers/round.controller";
import { GetRound } from "./application/use-cases/get-round.use-case";

@Module({
  providers: [RoundEngine, RunRound, GetRound, RoundGateway, RoundRepository],
  exports: [RoundEngine, RunRound],
  controllers: [RoundController],
})
export class RoundModule {}
