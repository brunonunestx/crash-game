import { BetStatus as BetStatusEnum } from "generated/prisma/enums";

export class BetStatus {
  value: BetStatusEnum;

  constructor(status: BetStatusEnum) {
    this.value = status;
  }

  isActive() {
    return this.value === BetStatusEnum.ACTIVE;
  }

  isCashedOut() {
    return this.value === BetStatusEnum.CASHED_OUT;
  }

  isLost() {
    return this.value === BetStatusEnum.LOST;
  }

  isCancelled() {
    return this.value === BetStatusEnum.CANCELED;
  }
}
