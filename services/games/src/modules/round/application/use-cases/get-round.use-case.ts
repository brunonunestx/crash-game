import { UseCase } from "@/shared/patterns/use-case";
import { RoundEngine } from "../engine/round.engine";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Round } from "../../domain/entities/round.entity";

@Injectable()
export class GetRound extends UseCase<void, Round> {
  constructor(private readonly roundEngine: RoundEngine) {
    super();
  }
  async execute() {
    const currentRound = this.roundEngine.getCurrentRound();
    if (!currentRound) {
      throw new InternalServerErrorException("No round is currently running");
    }

    return currentRound;
  }
}
