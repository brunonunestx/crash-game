import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { Round } from "../../domain/entities/round.entity";
import { RoundUpdatesDto } from "../dto/gateway.dto";

@WebSocketGateway()
export class RoundGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  handleConnection() {
    console.log("Client connected");
  }

  handleDisconnect() {
    console.log("Client disconnected");
  }

  broadcast(message: string, round: Round) {
    const dto = new RoundUpdatesDto(round);
    this.server.emit(message, dto);
  }
}
