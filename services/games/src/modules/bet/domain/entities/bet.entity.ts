import { BetStatus } from "../value-objects/bet-status.vo";
import { BetStatus as BetStatusEnum } from "generated/prisma/enums";

type BetProps = {
  id?: string;
  userEmail: string;
  roundId: string;
  amount: number;
  cashoutAt?: number;
  status: BetStatusEnum;
};

export class Bet {
  id: string;
  userEmail: string;
  roundId: string;
  amount: number;
  cashoutAt: number | undefined;
  status: BetStatus;
  createdAt: Date;

  constructor(props: BetProps) {
    this.id = props.id ?? "";
    this.userEmail = props.userEmail;
    this.roundId = props.roundId;
    this.amount = props.amount;
    this.status = new BetStatus(props.status);
    this.cashoutAt = props.cashoutAt;
    this.createdAt = new Date();
  }

  cashout(multiplier: number) {
    if (!this.status.isActive()) {
      throw new Error("Only active bets can be cashed out.");
    }

    this.status = new BetStatus(BetStatusEnum.CASHED_OUT);
    this.cashoutAt = multiplier;
  }

  cancel() {
    if (!this.status.isActive()) {
      throw new Error("Only active bets can be cancelled.");
    }

    this.status = new BetStatus(BetStatusEnum.CANCELED);
  }

  calculatePayout(multiplier: number): number {
    if (this.status.isLost()) {
      return 0;
    }

    if (this.status.isActive()) {
      throw new Error("Cannot calculate payout for an active bet.");
    }

    return this.amount * multiplier;
  }
}
