import { GetRound } from "@/modules/round/application/use-cases/get-round.use-case";
import { UseCase } from "@/shared/patterns/use-case";
import { BetRepository } from "../../infrastructure/repositories/bet.repository";

export class CashOutUseCase extends UseCase<{ userEmail: string }, void> {
  constructor(
    private readonly betRepository: BetRepository,
    private readonly getRound: GetRound,
  ) {
    super();
  }

  async execute({ userEmail }: { userEmail: string }): Promise<void> {
    const currentRound = await this.getRound.execute();
    if (!currentRound.status.isPlaying()) {
      throw new Error("Cannot cash out in a round that is not still playing.");
    }

    const activeBet =
      await this.betRepository.getActiveBetByUserEmail(userEmail);

    if (!activeBet) {
      throw new Error("No active bet found for this user.");
    }

    activeBet.cashout(currentRound.currentPoint);

    await this.betRepository.updateBet(activeBet);
  }
}
