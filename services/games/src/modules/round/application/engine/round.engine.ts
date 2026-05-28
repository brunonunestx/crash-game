import { Round } from "../../domain/entities/round.entity";

export class RoundEngine {
  round!: Round;

  setCurrentRound(round: Round) {
    this.round = round;
  }

  getCurrentRound(): Round {
    return this.round;
  }
}
