import { Module } from "@nestjs/common";
import { StoryService } from "../service/story.service";
import { StoryRepository } from "../repository/story.repository";
import { BaseRepository } from "../repository/base.repository";
import { HttpModule } from "@nestjs/axios";
import { CustomConfigService } from "../config";
import { UserCacheService } from "../service/user-cache.service";
import { StoryController } from "../controller/story.controller";
import { LoggerModule } from "../logger/logger.module";
import { LoggerService } from "../logger/logger.service";

@Module({
  imports: [HttpModule, LoggerModule.forRoot()],
  controllers: [StoryController],
  providers: [
    StoryService,
    StoryRepository,
    BaseRepository,
    UserCacheService,
    CustomConfigService,
    LoggerService,
  ],
  exports: [StoryService, CustomConfigService, LoggerService],
})
export class StoryModule {}
