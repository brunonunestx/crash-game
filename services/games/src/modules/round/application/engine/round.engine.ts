import { Round } from "../../domain/entities/round.entity";

export class RoundEngine {
  round: Round | null = null;

  setCurrentRound(round: Round) {
    this.round = round;
  }

  getCurrentRound(): Round | null {
    return this.round;
  }
}
