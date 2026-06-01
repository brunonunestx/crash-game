import { TransactionType } from "generated/prisma/enums";

type LedgerProps = {
  id?: string;
  userEmail: string;
  amount: number;
  type: TransactionType;
  createdAt?: Date;
};

export class Ledger {
  id: string;
  userEmail: string;
  amount: number;
  type: TransactionType;
  createdAt: Date;

  constructor({ id, userEmail, amount, type, createdAt }: LedgerProps) {
    this.id = id || crypto.randomUUID();
    this.userEmail = userEmail;
    this.amount = amount;
    this.type = type;
    this.createdAt = createdAt || new Date();
  }
}
