import { Round } from "../../domain/entities/round.entity";
import { IRound, RoundStatus } from "@crash-game/types";

export class RoundUpdatesDto implements IRound {
  id!: string;
  number!: number;
  hashedSeed!: string;
  currentPoint!: number;
  status!: RoundStatus;
  createdAt!: Date;

  constructor(round: Round) {
    this.id = round.id;
    this.number = round.number;
    this.hashedSeed = round.hashedSeed;
    this.currentPoint = round.currentPoint;
    this.status = round.status.value as RoundStatus;
    this.createdAt = round.createdAt;
  }
}
