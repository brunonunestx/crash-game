import { RoundStatus } from "generated/prisma/client";
import { Round } from "../../domain/entities/round.entity";

export class RoundUpdatesDto {
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
    this.status = round.status.value;
    this.createdAt = round.createdAt;
  }
}
