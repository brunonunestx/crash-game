import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices";
import { EventType } from "generated/prisma/enums";
import { RegisterInbox } from "../use-cases/register-inbox.use-case";
import { MessageDTO } from "../../presentation/dto/message.dto";

@Controller()
export class Subscriber {
  constructor(private readonly registerInboxUseCase: RegisterInbox) {}
  @EventPattern(EventType.BET_DONE)
  async handle(@Payload() payload: MessageDTO) {
    await this.registerInboxUseCase.execute(EventType.BET_DONE, payload);
  }

  @EventPattern(EventType.BET_WINNER)
  async handleBetWinner(@Payload() payload: MessageDTO) {
    await this.registerInboxUseCase.execute(EventType.BET_WINNER, payload);
  }
}
