import { RoundStatus } from "generated/prisma/enums";

export class RoundState {
  value: RoundStatus;

  constructor(value: RoundStatus) {
    this.value = value;
  }

  getValue() {
    return this.value;
  }

  isBetting() {
    return this.value === RoundStatus.BETTING;
  }

  isPlaying() {
    return this.value === RoundStatus.PLAYING;
  }

  isStarting() {
    return this.value === RoundStatus.STARTING;
  }

  isEnded() {
    return this.value === RoundStatus.ENDED;
  }
}
