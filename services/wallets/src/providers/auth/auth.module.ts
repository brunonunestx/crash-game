import { Global, Module } from "@nestjs/common";
import { AuthCron } from "./auth.cron";
import { AuthEngine } from "./auth.engine";
import { AuthGuard } from "./auth.guard";
import { ApiKeyGuard } from "./api-key.guard";

@Global()
@Module({
  providers: [AuthCron, AuthEngine, AuthGuard, ApiKeyGuard],
  exports: [AuthGuard, AuthEngine, ApiKeyGuard],
})
export class AuthModule {}
