import { WalletStatus as WalletStatusEnum } from "generated/prisma/enums";

export class WalletStatus {
  value: WalletStatusEnum;

  constructor(value: WalletStatusEnum) {
    this.value = value;
  }

  isActive(): boolean {
    return this.value === WalletStatusEnum.ACTIVE;
  }

  isSuspended(): boolean {
    return this.value === WalletStatusEnum.SUSPENDED;
  }

  isClosed(): boolean {
    return this.value === WalletStatusEnum.CLOSED;
  }
}
