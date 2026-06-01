import { Global, Module } from "@nestjs/common";
import { AuthCron } from "./auth.cron";
import { AuthEngine } from "./auth.engine";
import { AuthGuard } from "./auth.guard";

@Global()
@Module({
  providers: [AuthCron, AuthEngine, AuthGuard],
  exports: [AuthGuard, AuthEngine],
})
export class AuthModule {}
