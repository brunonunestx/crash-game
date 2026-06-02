import { Injectable } from "@nestjs/common";
import { UseCase } from "@/shared/patterns/use-case";
import { CloseOpenedBetsUseCase } from "@/modules/bet/application/use-cases/close-opened-bets.use-case";

@Injectable()
export class FinishRoundUseCase extends UseCase<{ roundId: string }, void> {
  constructor(private readonly closeOpenedBetsUseCase: CloseOpenedBetsUseCase) {
    super();
  }

  async execute({ roundId }: { roundId: string }): Promise<void> {
    await this.closeOpenedBetsUseCase.execute({ roundId });
  }
}
