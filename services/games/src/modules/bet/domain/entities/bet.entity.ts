import { centsToDouble } from "@crash-game/utils";
import { BetStatus } from "../value-objects/bet-status.vo";
import { BetStatus as BetStatusEnum } from "generated/prisma/enums";

type BetProps = {
  id?: string;
  userEmail: string;
  roundId: string;
  roundNumber?: number;
  amount: number;
  cashoutAt?: number;
  status: BetStatusEnum;
  createdAt?: Date;
};

export class Bet {
  id: string;
  userEmail: string;
  roundId: string;
  roundNumber: number;
  amount: number;
  cashoutAt: number | undefined;
  status: BetStatus;
  createdAt: Date;

  constructor(props: BetProps) {
    this.id = props.id ?? "";
    this.userEmail = props.userEmail;
    this.roundId = props.roundId;
    this.roundNumber = props.roundNumber ?? 0;
    this.amount = props.amount;
    this.status = new BetStatus(props.status);
    this.cashoutAt = props.cashoutAt;
    this.createdAt = props.createdAt ?? new Date();
  }

  cashout(multiplier: number) {
    if (!this.status.isActive()) {
      throw new Error("Only active bets can be cashed out.");
    }

    this.status = new BetStatus(BetStatusEnum.CASHED_OUT);
    this.cashoutAt = multiplier;
  }

  lost() {
    if (!this.status.isActive()) {
      throw new Error("Only active bets can be marked as lost.");
    }

    this.status = new BetStatus(BetStatusEnum.LOST);
  }

  cancel() {
    if (!this.status.isActive()) {
      throw new Error("Only active bets can be cancelled.");
    }

    this.status = new BetStatus(BetStatusEnum.CANCELED);
  }

  calculatePayout(): number {
    if (this.status.isLost()) {
      return 0;
    }

    if (this.status.isActive()) {
      throw new Error("Cannot calculate payout for an active bet.");
    }

    const doubleMultiplier = centsToDouble(this.cashoutAt ?? 0);
    const payout = Math.floor(this.amount * doubleMultiplier);

    return payout;
  }
}
