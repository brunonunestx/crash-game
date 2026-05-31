import { ICashoutResponse } from "@crash-game/types";

export class CashOutResponseDto implements ICashoutResponse {
  multiplier: number;
  cashoutAmount: number;

  constructor(multiplier: number, cashoutAmount: number) {
    this.multiplier = multiplier;
    this.cashoutAmount = cashoutAmount;
  }
}
