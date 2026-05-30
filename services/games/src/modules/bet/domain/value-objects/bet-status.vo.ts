export class BetStatus {
  value: string;

  constructor(private readonly status: string) {
    if (!status) {
      throw new Error("Bet status is required.");
    }
    this.value = status;
  }
}
