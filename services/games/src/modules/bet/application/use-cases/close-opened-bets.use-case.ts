import { UseCase } from "@/shared/patterns/use-case";
import { BetRepository } from "../../infrastructure/repositories/bet.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CloseOpenedBetsUseCase extends UseCase<{ roundId: string }, void> {
  constructor(private readonly betRepository: BetRepository) {
    super();
  }

  async execute({ roundId }: { roundId: string }): Promise<void> {
    const openedBets =
      await this.betRepository.findOpenedBetsByRoundId(roundId);

    const lostBets = openedBets.map((bet) => {
      bet.lost();
      return bet;
    });

    await this.betRepository.closeManyBets(lostBets);
  }
}
