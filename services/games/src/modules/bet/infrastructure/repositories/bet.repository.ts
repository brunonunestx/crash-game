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
}
