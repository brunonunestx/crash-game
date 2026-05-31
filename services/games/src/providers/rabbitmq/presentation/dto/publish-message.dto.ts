import { EventType } from "generated/prisma/enums";

export type Message = {
  userEmail: string;
  amount: number;
  eventType: EventType;
};

export class PublishMessageDto {
  messages: Message[];

  constructor(messages: Message[]) {
    this.messages = messages;
  }
}
