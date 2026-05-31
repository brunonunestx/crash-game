import { DatabaseService } from "@/providers/database/database.service";
import { Bet } from "../../domain/entities/bet.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class BetRepository {
  constructor(private readonly database: DatabaseService) {}
  async createBet(bet: Bet): Promise<Bet> {
    const createdBet = await this.database.bet.create({
      data: {
        userEmail: bet.userEmail,
        roundId: bet.roundId,
        amount: bet.amount,
        status: bet.status.value,
      },
    });

    return new Bet({
      id: createdBet.id,
      userEmail: createdBet.userEmail,
      roundId: createdBet.roundId,
      amount: createdBet.amount,
      status: createdBet.status,
      cashoutAt: createdBet.cashoutAt ?? undefined,
      createdAt: createdBet.createdAt,
    });
  }

  async getActiveBetByUserEmail(userEmail: string): Promise<Bet | null> {
    const bet = await this.database.bet.findFirst({
      where: {
        userEmail,
        status: "ACTIVE",
      },
    });

    if (!bet) {
      return null;
    }

    return new Bet({
      id: bet.id,
      userEmail: bet.userEmail,
      roundId: bet.roundId,
      amount: bet.amount,
      status: bet.status,
      cashoutAt: bet.cashoutAt ?? undefined,
      createdAt: bet.createdAt,
    });
  }

  async updateBet(bet: Bet): Promise<void> {
    await this.database.bet.update({
      where: {
        id: bet.id,
      },
      data: {
        status: bet.status.value,
        cashoutAt: bet.cashoutAt,
      },
    });
  }

  async findWinnersByRoundId(roundId: string): Promise<Bet[]> {
    const bets = await this.database.bet.findMany({
      where: {
        roundId,
        status: "CASHED_OUT",
      },
    });

    return bets
      .filter((bet) => bet.cashoutAt)
      .map((bet) => {
        return new Bet({
          id: bet.id,
          userEmail: bet.userEmail,
          roundId: bet.roundId,
          amount: bet.amount,
          status: bet.status,
          cashoutAt: bet.cashoutAt!,
          createdAt: bet.createdAt,
        });
      });
  }

  async findOpenedBetsByRoundId(roundId: string): Promise<Bet[]> {
    const bets = await this.database.bet.findMany({
      where: {
        roundId,
        status: "ACTIVE",
      },
    });

    return bets.map((bet) => {
      return new Bet({
        id: bet.id,
        userEmail: bet.userEmail,
        roundId: bet.roundId,
        amount: bet.amount,
        status: bet.status,
        cashoutAt: bet.cashoutAt ?? undefined,
        createdAt: bet.createdAt,
      });
    });
  }

  async closeManyBets(bets: Bet[]): Promise<void> {
    const ids = bets.map((bet) => bet.id);

    await this.database.bet.updateMany({
      where: { id: { in: ids } },
      data: { status: "LOST" },
    });
  }
}
