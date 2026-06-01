export class MessageDTO {
  id: string;
  userEmail: string;
  amount: number;

  constructor(id: string, userEmail: string, amount: number) {
    this.id = id;
    this.userEmail = userEmail;
    this.amount = amount;
  }
}
