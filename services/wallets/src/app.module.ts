import { Module } from "@nestjs/common";
import { providers } from "./providers";
import { ScheduleModule } from "@nestjs/schedule";
import { modules } from "./modules";

@Module({
  imports: [...providers, ...modules, ScheduleModule.forRoot()],
  controllers: [],
})
export class AppModule {}
