import { UseCase } from "@/shared/patterns/use-case";
import { Injectable, NotFoundException } from "@nestjs/common";
import { RoundRepository } from "../../infrastructure/repositories/round.repository";

type Input = { roundId: string };

export type RoundVerifyData = {
  roundId: string;
  nounce: number;
  seed: string;
  hashedSeed: string;
  breakPoint: number;
};

@Injectable()
export class GetRoundVerify extends UseCase<Input, RoundVerifyData> {
  constructor(private readonly roundRepository: RoundRepository) {
    super();
  }

  async execute({ roundId }: Input): Promise<RoundVerifyData> {
    const round = await this.roundRepository.findEndedRoundById(roundId);

    if (!round) {
      throw new NotFoundException(
        "Round not found or not yet finished",
      );
    }

    return {
      roundId: round.id,
      nounce: round.number,
      seed: round.seed,
      hashedSeed: round.hashedSeed,
      breakPoint: round.breakPoint,
    };
  }
}
