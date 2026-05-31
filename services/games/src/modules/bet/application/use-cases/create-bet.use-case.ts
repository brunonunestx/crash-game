import { UseCase } from "@/shared/patterns/use-case";
import { CreateBetDto } from "../../presentation/dto/create-bet.dto";
import { Bet } from "../../domain/entities/bet.entity";
import { BetStatus as BetStatusEnum } from "generated/prisma/enums";
import { BetRepository } from "../../infrastructure/repositories/bet.repository";
import { Injectable } from "@nestjs/common";
import { GetRound } from "@/modules/round/application/use-cases/get-round.use-case";

@Injectable()
export class CreateBet extends UseCase<
  CreateBetDto & { userEmail: string },
  Bet
> {
  constructor(
    private readonly betRepository: BetRepository,
    private readonly getRound: GetRound,
  ) {
    super();
  }
  async execute(input: CreateBetDto & { userEmail: string }): Promise<Bet> {
    const currentRound = await this.getRound.execute();

    const activeBet = await this.betRepository.getActiveBetByUserEmail(
      input.userEmail,
    );

    if (activeBet) {
      throw new Error("User already has an active bet.");
    }

    const bet = new Bet({
      roundId: currentRound.id,
      amount: input.amount,
      userEmail: input.userEmail,
      status: BetStatusEnum.ACTIVE,
    });

    const createdBet = await this.betRepository.createBet(bet);

    return createdBet;
  }
}
