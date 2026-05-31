import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthEngine {
  certs: any = null;

  constructor() {}

  async setCerts(certs: any) {
    this.certs = certs;
  }

  getCerts() {
    return this.certs;
  }
}
