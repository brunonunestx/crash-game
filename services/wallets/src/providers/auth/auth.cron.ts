import { cronTimes } from "@crash-game/constants";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { AuthEngine } from "./auth.engine";

@Injectable()
export class AuthCron implements OnModuleInit {
  keycloakUrl = process.env.KEYCLOAK_URL;
  realm = process.env.KEYCLOAK_REALM;
  constructor(private readonly authEngine: AuthEngine) {}

  async onModuleInit() {
    await this.handleCron();
  }

  @Cron(cronTimes.every.fiveSeconds)
  async handleCron() {
    if (!this.keycloakUrl || !this.realm) {
      console.warn(
        "KEYCLOAK_URL or KEYCLOAK_REALM is not defined. Skipping Auth Cron Job.",
      );
      return;
    }

    try {
      const response = await fetch(
        `${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/certs`,
      );
      const keys = await response.json();
      await this.authEngine.setCerts(keys);
    } catch {
      console.warn("Failed to fetch Keycloak certs. Will retry.");
    }
  }
}
