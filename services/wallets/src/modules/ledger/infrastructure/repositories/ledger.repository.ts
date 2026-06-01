import { Injectable } from "@nestjs/common";
import { Ledger } from "../../domain/entities/ledger.entity";
import { DatabaseService } from "@/providers/database/database.service";

@Injectable()
export class LedgerRepository {
  constructor(private readonly database: DatabaseService) {}
  async save(ledger: Ledger) {
    await this.database.ledger.create({
      data: {
        id: ledger.id,
        userEmail: ledger.userEmail,
        amount: ledger.amount,
        type: ledger.type,
        createdAt: ledger.createdAt,
      },
    });
  }

  async getCurrentBalance(userEmail: string): Promise<number> {
    const result = await this.database.$queryRaw<[{ balance: bigint | null }]>`
      SELECT SUM(
        CASE
          WHEN type IN ('WITHDRAW', 'LOSS') THEN -amount
          ELSE amount
        END
      ) AS balance
      FROM "Ledger"
      WHERE "userEmail" = ${userEmail}
    `;

    return Number(result[0]?.balance ?? 0);
  }
}
