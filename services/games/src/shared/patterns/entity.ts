import { randomUUID } from "node:crypto";

export class Entity {
  id: string;

  constructor() {
    this.id = randomUUID();
  }
}
