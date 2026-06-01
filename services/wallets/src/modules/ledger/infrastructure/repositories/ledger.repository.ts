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
}
