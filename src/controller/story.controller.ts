import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { StoryService } from "../service/story.service";

@Controller("story")
@ApiTags("story")
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @ApiOperation({ summary: "Top 10 Trending Words from Recent Stories" })
  @Get("/top-words/last-25-stories")
  async topWordsLastStories() {
    return this.storyService.topWordsLastStories();
  }

  @ApiOperation({ summary: "Top 10 Weekly Title Keywords" })
  @Get("/top-words/last-week")
  async topWordsLastWeek() {
    return this.storyService.topWordsLastWeek();
  }

  @ApiOperation({ summary: "Top 10 High-Karma User Story Keywords" })
  @Get("/top-words/high-karma-users")
  async topWordsWithHighKarma() {
    return this.storyService.topWordsWithHighKarma(10000);
  }
}
