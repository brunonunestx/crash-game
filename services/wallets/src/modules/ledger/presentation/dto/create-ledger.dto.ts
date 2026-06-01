import { EventType } from "generated/prisma/enums";

export class CreateLedgerDto {
  userEmail: string;
  amount: number;
  type: EventType;

  constructor(userEmail: string, amount: number, type: EventType) {
    this.userEmail = userEmail;
    this.amount = amount;
    this.type = type;
  }
}
