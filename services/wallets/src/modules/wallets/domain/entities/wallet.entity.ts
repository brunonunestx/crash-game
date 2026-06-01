import { WalletStatus } from "../value-objects/wallet-status.vo";
import { WalletStatus as WalletStatusEnum } from "generated/prisma/enums";

type WalletProps = {
  id?: string;
  owner: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
  status: WalletStatusEnum;
};

export class Wallet {
  id: string;
  owner: string;
  balance: number;
  status: WalletStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: WalletProps) {
    this.id = props.id || crypto.randomUUID();
    this.owner = props.owner;
    this.balance = props.balance;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.status = new WalletStatus(props.status);
  }

  canBet(amount: number): boolean {
    return this.balance >= amount;
  }

  updateBalance(amount: number) {
    this.balance += amount;
    this.updatedAt = new Date();
  }
}
