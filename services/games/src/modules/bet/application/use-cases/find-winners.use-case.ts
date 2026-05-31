import { UseCase } from "@/shared/patterns/use-case";
import { BetRepository } from "../../infrastructure/repositories/bet.repository";
import { Injectable } from "@nestjs/common";
import { Bet } from "../../domain/entities/bet.entity";

@Injectable()
export class FindWinnersUseCase extends UseCase<{ roundId: string }, Bet[]> {
  constructor(private readonly betRepository: BetRepository) {
    super();
  }

  async execute({ roundId }: { roundId: string }): Promise<Bet[]> {
    const winners = await this.betRepository.findWinnersByRoundId(roundId);

    return winners;
  }
}
