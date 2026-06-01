import { GetRound } from "@/modules/round/application/use-cases/get-round.use-case";
import { UseCase } from "@/shared/patterns/use-case";
import { BetRepository } from "../../infrastructure/repositories/bet.repository";
import { Injectable } from "@nestjs/common";
import { CashOutResponseDto } from "../../presentation/dto/cash-out.dto";
import { PublishMessagesUseCase } from "@/providers/rabbitmq/application/use-cases/publish-message.use-case";
import { EventType } from "generated/prisma/client";

@Injectable()
export class CashOutUseCase extends UseCase<
  { userEmail: string },
  CashOutResponseDto
> {
  constructor(
    private readonly betRepository: BetRepository,
    private readonly getRound: GetRound,
    private readonly publishMessagesUseCase: PublishMessagesUseCase,
  ) {
    super();
  }

  async execute({
    userEmail,
  }: {
    userEmail: string;
  }): Promise<CashOutResponseDto> {
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

    const cashoutAt = activeBet.cashoutAt;
    if (!cashoutAt) {
      throw new Error("Cashout point not found.");
    }

    await this.publishMessagesUseCase.execute({
      messages: [
        {
          eventType: EventType.BET_WINNER,
          userEmail,
          amount: activeBet.calculatePayout(),
        },
      ],
    });

    return new CashOutResponseDto(cashoutAt, activeBet.calculatePayout());
  }
}
