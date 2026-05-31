import { Injectable } from "@nestjs/common";
import { UseCase } from "@/shared/patterns/use-case";
import { FindWinnersUseCase } from "@/modules/bet/application/use-cases/find-winners.use-case";
import { CloseOpenedBetsUseCase } from "@/modules/bet/application/use-cases/close-opened-bets.use-case";

@Injectable()
export class FinishRoundUseCase extends UseCase<{ roundId: string }, void> {
  constructor(
    private readonly closeOpenedBetsUseCase: CloseOpenedBetsUseCase,
    private readonly findWinnersUseCase: FindWinnersUseCase,
  ) {
    super();
  }

  async execute({ roundId }: { roundId: string }): Promise<void> {
    await this.closeOpenedBetsUseCase.execute({ roundId });

    const winners = await this.findWinnersUseCase.execute({ roundId });
  }
}
