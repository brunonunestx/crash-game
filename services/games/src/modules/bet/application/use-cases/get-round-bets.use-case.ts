import { Injectable } from "@nestjs/common";
import { UseCase } from "@/shared/patterns/use-case";
import { BetRepository } from "../../infrastructure/repositories/bet.repository";

type Input = { roundId: string };

export type RoundBetDto = {
  id: string;
  userEmail: string;
  amount: number;
  cashoutAt: number | null;
  status: string;
};

@Injectable()
export class GetRoundBets extends UseCase<Input, RoundBetDto[]> {
  constructor(private readonly betRepository: BetRepository) {
    super();
  }

  async execute({ roundId }: Input): Promise<RoundBetDto[]> {
    const bets = await this.betRepository.findBetsByRoundId(roundId);
    return bets.map((bet) => ({
      id: bet.id,
      userEmail: bet.userEmail,
      amount: bet.amount,
      cashoutAt: bet.cashoutAt ?? null,
      status: bet.status.value,
    }));
  }
}
