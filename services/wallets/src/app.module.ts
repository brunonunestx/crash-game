import { Module } from "@nestjs/common";
import { providers } from "./providers";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [...providers, ScheduleModule.forRoot()],
  controllers: [],
})
export class AppModule {}
