import { UseCase } from "@/shared/patterns/use-case";
import { CreateBetDto } from "../../presentation/dto/create-bet.dto";
import { Bet } from "../../domain/entities/bet.entity";
import { BetStatus as BetStatusEnum, EventType } from "generated/prisma/enums";
import { BetRepository } from "../../infrastructure/repositories/bet.repository";
import { Injectable } from "@nestjs/common";
import { GetRound } from "@/modules/round/application/use-cases/get-round.use-case";
import { PublishMessagesUseCase } from "@/providers/rabbitmq/application/use-cases/publish-message.use-case";

@Injectable()
export class CreateBet extends UseCase<
  CreateBetDto & { userEmail: string },
  Bet
> {
  constructor(
    private readonly betRepository: BetRepository,
    private readonly getRound: GetRound,
    private readonly publishMessagesUseCase: PublishMessagesUseCase,
  ) {
    super();
  }
  async execute(input: CreateBetDto & { userEmail: string }): Promise<Bet> {
    const currentRound = await this.getRound.execute();

    if (!currentRound.status.isBetting()) {
      throw new Error("Bets are only allowed during the betting phase.");
    }

    const activeBet = await this.betRepository.getActiveBetByUserEmail(
      input.userEmail,
    );

    if (activeBet) {
      throw new Error("User already has an active bet.");
    }

    const canBet = await this.validateBetAmount(input.userEmail, input.amount);

    if (!canBet) {
      throw new Error("User does not have enough balance to place this bet.");
    }

    const bet = new Bet({
      roundId: currentRound.id,
      amount: input.amount,
      userEmail: input.userEmail,
      status: BetStatusEnum.ACTIVE,
    });

    const createdBet = await this.betRepository.createBet(bet);

    await this.publishMessagesUseCase.execute({
      messages: [
        {
          eventType: EventType.BET_DONE,
          userEmail: input.userEmail,
          amount: input.amount,
        },
      ],
    });

    return createdBet;
  }

  private async validateBetAmount(
    userEmail: string,
    amount: number,
  ): Promise<boolean> {
    if (amount <= 0) {
      throw new Error("Bet amount must be greater than zero.");
    }

    const walletUrl = process.env.WALLET_SERVICE_URL ?? "http://localhost:4002";
    const response = await fetch(
      `${walletUrl}/wallets/can-bet?userEmail=${userEmail}&betAmount=${amount}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.INTERNAL_API_KEY ?? "",
        },
      },
    );

    const { canBet } = await response.json();

    return canBet;
  }
}
