import { DatabaseService } from "@/providers/database/database.service";

export class BetRepository {
  constructor(private readonly database: DatabaseService) {}
  async createBet(
    roundId: string,
    amount: number,
    userEmail: string,
  ): Promise<void> {
    console.log(
      `Creating bet with roundId: ${roundId}, amount: ${amount}, and userEmail: ${userEmail}`,
    );
  }
}
