import { queueTopics } from "@crash-game/constants";
import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

type Topic = keyof typeof queueTopics;

@Injectable()
export class PublisherService {
  constructor(
    @Inject("RABBITMQ_SERVICE")
    private readonly client: ClientProxy,
  ) {}

  async publish(topic: Topic, data: { userEmail: string; amount: number }) {
    return this.client.emit(queueTopics[topic], data);
  }
}
