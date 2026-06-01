import { UseCase } from "@/shared/patterns/use-case";
import { BetRepository } from "../../infrastructure/repositories/bet.repository";
import { GetRound } from "@/modules/round/application/use-cases/get-round.use-case";
import { Injectable } from "@nestjs/common";
import { PublishMessagesUseCase } from "@/providers/rabbitmq/application/use-cases/publish-message.use-case";
import { EventType } from "generated/prisma/client";

@Injectable()
export class CancelBet extends UseCase<{ userEmail: string }, void> {
  constructor(
    private readonly betRepository: BetRepository,
    private readonly getRound: GetRound,
    private readonly publishMessagesUseCase: PublishMessagesUseCase,
  ) {
    super();
  }

  async execute({ userEmail }: { userEmail: string }): Promise<void> {
    const currentRound = await this.getRound.execute();
    if (!currentRound.status.isBetting()) {
      throw new Error("Cannot cancel bet in a round that is not betting.");
    }

    const activeBet =
      await this.betRepository.getActiveBetByUserEmail(userEmail);

    if (!activeBet) {
      throw new Error("No active bet found for this user.");
    }

    activeBet.cancel();

    await this.betRepository.updateBet(activeBet);

    await this.publishMessagesUseCase.execute({
      messages: [
        {
          eventType: EventType.BET_CANCELED,
          userEmail,
          amount: activeBet.amount,
        },
      ],
    });
  }
}
