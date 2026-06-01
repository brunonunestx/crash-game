import { EventType, TransactionType } from "generated/prisma/enums";
import { Ledger } from "../../domain/entities/ledger.entity";
import { CreateLedgerDto } from "../../presentation/dto/create-ledger.dto";
import { Injectable } from "@nestjs/common";
import { LedgerRepository } from "../../infrastructure/repositories/ledger.repository";

const mapType = {
  [EventType.BET_DONE]: TransactionType.LOSS,
  [EventType.BET_WINNER]: TransactionType.WIN,
};

@Injectable()
export class CreateLedgerItemUseCase {
  constructor(private readonly ledgerRepository: LedgerRepository) {}

  async execute(payload: CreateLedgerDto) {
    const ledgerItem = new Ledger({
      userEmail: payload.userEmail,
      amount: payload.amount,
      type: mapType[payload.type],
    });

    await this.ledgerRepository.save(ledgerItem);
  }
}
