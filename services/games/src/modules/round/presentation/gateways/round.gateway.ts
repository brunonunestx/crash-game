import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Round } from "../../domain/entities/round.entity";
import { RoundUpdatesDto } from "../dto/gateway.dto";
import { messages } from "@crash-game/constants";
import { RoundEngine } from "../../application/engine/round.engine";

@WebSocketGateway({ path: "/games/socket.io" })
export class RoundGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly roundEngine: RoundEngine) {}
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    const round = this.roundEngine.getCurrentRound();
    if (!round) return;
    client.emit(messages.syncRound, new RoundUpdatesDto(round));
  }

  handleDisconnect(_client: Socket) {}

  broadcast(message: string, round: Round) {
    const dto = new RoundUpdatesDto(round);
    this.server.emit(message, dto);
  }
}
