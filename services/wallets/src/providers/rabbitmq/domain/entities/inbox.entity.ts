import { EventType } from "generated/prisma/enums";

type InboxProps = {
  id?: string;
  payload: { id: string; userEmail: string; amount: number };
  eventType: EventType;
  messageId?: string;
  processed?: boolean;
  createdAt?: Date;
};

export class Inbox {
  id: string;
  payload: { id: string; userEmail: string; amount: number };
  eventType: EventType;
  messageId: string;
  processed: boolean = false;
  createdAt: Date;

  constructor({
    id,
    payload,
    eventType,
    messageId,
    processed,
    createdAt,
  }: InboxProps) {
    this.id = id || crypto.randomUUID();
    this.createdAt = createdAt || new Date();
    this.payload = payload;
    this.messageId = messageId || payload.id;
    this.processed = processed || false;
    this.eventType = eventType;
  }

  isProcessed(): boolean {
    return this.processed;
  }

  markAsProcessed(): void {
    this.processed = true;
  }
}
