import { UseCase } from "@/shared/patterns/use-case";
import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { cronTimes, gameTimings, messages } from "@crash-game/constants";
import { Round } from "../../domain/entities/round.entity";
import { RoundEngine } from "../engine/round.engine";
import { delay } from "@crash-game/utils";
import { RoundGateway } from "../../presentation/gateways/round.gateway";
import { RoundRepository } from "../../infrastructure/repositories/round.repository";
import { FinishRoundUseCase } from "./finish-round.use-case";

const timings = {
  starting: 1000,
  betting: gameTimings.bettingDurationMs,
};

function getPlayingDelay(currentPoint: number): number {
  const multiplier = currentPoint / 100;
  if (multiplier >= 40) return 10;
  if (multiplier >= 30) return 20;
  if (multiplier >= 20) return 30;
  if (multiplier >= 10) return 40;
  return 50;
}

@Injectable()
export class RunRound extends UseCase<void, void> {
  constructor(
    private readonly roundEngine: RoundEngine,
    private readonly roundGateway: RoundGateway,
    private readonly roundRepository: RoundRepository,
    private readonly finishRoundUseCase: FinishRoundUseCase,
  ) {
    super();
  }
  @Cron(cronTimes.every.fiveSeconds)
  async execute() {
    const runningRound = this.roundEngine.getCurrentRound();

    if (
      runningRound &&
      (runningRound.status.isPlaying() || runningRound.status.isBetting())
    ) {
      return;
    }

    const lastRoundNumber = await this.roundRepository.getLastRoundNumber();

    const round = new Round({ nounce: lastRoundNumber + 1 });
    this.roundEngine.setCurrentRound(round);
    this.roundGateway.broadcast(messages.roundUpdate, round);
    await this.roundRepository.createRound(round);

    await delay(timings.starting);
    round.startBetting();
    this.roundEngine.setCurrentRound(round);
    this.roundGateway.broadcast(messages.roundUpdate, round);
    await this.roundRepository.updateRound(round);

    await delay(timings.betting);
    round.startPlaying();
    this.roundEngine.setCurrentRound(round);
    this.roundGateway.broadcast(messages.roundUpdate, round);
    await this.roundRepository.updateRound(round);

    const crashAt = round.calculateCrashPoint();

    while (round.currentPoint < crashAt) {
      await delay(getPlayingDelay(round.currentPoint));
      round.incrementPoint();
      this.roundEngine.setCurrentRound(round);
      this.roundGateway.broadcast(messages.roundUpdate, round);
    }

    round.endRound();
    this.roundEngine.setCurrentRound(round);
    await this.roundRepository.updateRound(round);
    this.roundGateway.broadcast(messages.roundUpdate, round);

    await this.finishRoundUseCase.execute({ roundId: round.id });
  }
}
