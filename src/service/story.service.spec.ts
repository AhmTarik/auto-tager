import { StoryService } from "./story.service";
import { Test, TestingModule } from "@nestjs/testing";
import { CustomConfigService } from "../config";
import { BaseRepository } from "../repository/base.repository";
import { StoryRepository } from "../repository/story.repository";
import { UserCacheService } from "./user-cache.service";
import { LoggerService } from "../logger/logger.service";
import { HttpModule } from "@nestjs/axios";

describe("StoryService", () => {
  let service: StoryService;
  let logger: LoggerService;
  let storyRepository: StoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        {
          provide: "LoggerServiceStoryService",
          useValue: {
            constructor: jest.fn(),
            log: jest.fn(),
          },
        },
        BaseRepository,
        CustomConfigService,
        // {
        //   provide: StoryRepository,
        //   useValue: {
        //     getTopStories: async () => {
        //       return mockTopStoryIds;
        //     },
        //   },
        // },
        StoryRepository,
        UserCacheService,
        StoryService,
      ],
    }).compile();
    // logger = module.get<LoggerService>("LoggerServiceStoryService");
    storyRepository = await module.resolve<StoryRepository>(StoryRepository);

    service = await module.resolve<StoryService>(StoryService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should successfully return top  10 most occurring words in the titles of the last 25 stories", async () => {
    const result = await service.topWordsLastStories();
    // console.log("result", result);
    expect(result).toBeInstanceOf(Object);
    expect(result.top).toBeInstanceOf(Array);
    expect(result.titles).toBeInstanceOf(Array);
    expect(result.ids).toBeInstanceOf(Array);
  });

  it("should successfully return top top 10 most occurring words in the titles of the post of exactly the last week", async () => {
    const result = await service.topWordsLastWeek();
    expect(result).toBeInstanceOf(Object);
    expect(result.top).toBeInstanceOf(Array);
    expect(result.titles).toBeInstanceOf(Array);
    expect(result.ids).toBeInstanceOf(Array);
    const oneWeekAgo = new Date(
      (Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60) * 1000
    );
    result.ids.forEach(async (element) => {
      const story = await storyRepository.getItem(element);
      expect(story).toBeDefined();
      const storyTime = new Date(story.time * 1000);
      expect(storyTime.getTime()).toBeGreaterThanOrEqual(oneWeekAgo.getTime());
    });
  });

  it("should successfully return tthe top 10 most occurring words in titles of the last 600 stories posted by users with at least a specified amount of karma.", async () => {
    const karma = 10000;
    const result = await service.topWordsWithHighKarma(karma);
    expect(result).toBeInstanceOf(Object);
    expect(result.top).toBeInstanceOf(Array);
    expect(result.titles).toBeInstanceOf(Array);
    expect(result.ids).toBeInstanceOf(Array);
    result.ids.forEach(async (element) => {
      const story = await storyRepository.getItem(element);
      expect(story).toBeDefined();
      const user = await storyRepository.getUser(story.by);
      expect(user).toBeDefined();
      expect(user.karma).toBeGreaterThanOrEqual(karma);
    });
  }, 20000);
});
