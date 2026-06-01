import { EventType, TransactionType } from "generated/prisma/enums";

export class CreateLedgerDto {
  userEmail: string;
  amount: number;
  type: EventType | "WITHDRAW" | "DEPOSIT";

  constructor(
    userEmail: string,
    amount: number,
    type: EventType | "WITHDRAW" | "DEPOSIT",
  ) {
    this.userEmail = userEmail;
    this.amount = amount;
    this.type = type;
  }
}
