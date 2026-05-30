import { BetStatus } from "../value-objects/bet-status.vo";

export class Bet {
  id: string;
  userId: string;
  roundId: string;
  amount: number;
  cashoutAt: number;
  status: BetStatus;
  createdAt: Date;

  constructor(
    id: string,
    userId: string,
    roundId: string,
    amount: number,
    cashoutAt: number,
    status: BetStatus,
    createdAt: Date,
  ) {
    this.id = id;
    this.userId = userId;
    this.roundId = roundId;
    this.amount = amount;
    this.status = status;
    this.cashoutAt = cashoutAt;
    this.createdAt = createdAt;
  }
}
