import { EventType } from "generated/prisma/enums";

type OutboxProps = {
  id?: string;
  eventType: EventType;
  userEmail: string;
  amount: number;
  processed?: boolean;
};

export class Outbox {
  id: string;
  eventType: EventType;
  userEmail: string;
  amount: number;
  processed: boolean;
  createdAt: Date;

  constructor({ id, eventType, userEmail, amount, processed }: OutboxProps) {
    this.id = id || crypto.randomUUID();
    this.eventType = eventType;
    this.userEmail = userEmail;
    this.amount = amount;
    this.processed = processed || false;
    this.createdAt = new Date();
  }

  markAsProcessed() {
    if (this.processed) {
      throw new Error("Message is already marked as processed.");
    }
    this.processed = true;
  }
}
