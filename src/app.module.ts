import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { StoryModule } from "./module/story.module";
import { WinstonModule } from "nest-winston";
import * as winston from "winston";
import { CustomConfigService } from "config";
import { LoggerModule } from "logger/logger.module";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: false,
    }),
    StoryModule,
    WinstonModule.forRoot({
      level: "info",
      format: winston.format.json(),
    }),
    LoggerModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, CustomConfigService],
  exports: [AppService, CustomConfigService],
})
export class AppModule {}
