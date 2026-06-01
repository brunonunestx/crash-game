import { Injectable } from "@nestjs/common";
import { UseCase } from "@/shared/patterns/use-case";
import { BetRepository } from "../../infrastructure/repositories/bet.repository";

type Input = {
  userEmail: string;
  page: number;
  limit: number;
};

export type MyBetDto = {
  id: string;
  roundId: string;
  roundNumber: number;
  amount: number;
  cashoutAt: number | null;
  status: string;
  createdAt: Date;
};

export type MyBetsPage = {
  bets: MyBetDto[];
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
};

@Injectable()
export class GetMyBets extends UseCase<Input, MyBetsPage> {
  constructor(private readonly betRepository: BetRepository) {
    super();
  }

  async execute({ userEmail, page, limit }: Input): Promise<MyBetsPage> {
    const { bets, total } = await this.betRepository.findByUserEmail(
      userEmail,
      page,
      limit,
    );

    return {
      bets: bets.map((bet) => ({
        id: bet.id,
        roundId: bet.roundId,
        roundNumber: bet.roundNumber,
        amount: bet.amount,
        cashoutAt: bet.cashoutAt ?? null,
        status: bet.status.value,
        createdAt: bet.createdAt,
      })),
      currentPage: page,
      itemsPerPage: limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    };
  }
}
