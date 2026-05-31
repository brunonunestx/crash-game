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

@WebSocketGateway()
export class RoundGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly roundEngine: RoundEngine) {}
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    client.emit(messages.syncRound, this.roundEngine.getCurrentRound());
  }

  handleDisconnect(client: Socket) {
    console.log("Client disconnected");
  }

  broadcast(message: string, round: Round) {
    const dto = new RoundUpdatesDto(round);
    this.server.emit(message, dto);
  }
}
