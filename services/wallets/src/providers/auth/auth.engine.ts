import { Injectable } from "@nestjs/common";

type JwkSet = { keys: object[] }

@Injectable()
export class AuthEngine {
  certs: JwkSet | null = null;

  constructor() {}

  async setCerts(certs: JwkSet) {
    this.certs = certs;
  }

  getCerts(): JwkSet | null {
    return this.certs;
  }
}
