import { Test, TestingModule } from "@nestjs/testing";
import { CustomConfigService } from "../config";
import { BaseRepository } from "../repository/base.repository";
import { StoryRepository } from "../repository/story.repository";
import { HttpModule } from "@nestjs/axios";

describe("StoryRepository", () => {
  let service: StoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [BaseRepository, CustomConfigService, StoryRepository],
    }).compile();

    service = await module.resolve<StoryRepository>(StoryRepository);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("[Story]:section", () => {
    it("should get exit story successfully from hacker-news API ", async () => {
      const itemId = 37277033;
      const story = await service.getItem(itemId);
      expect(story).toBeInstanceOf(Object);
      expect(story.by).toEqual("pg_1234");
      expect(story.id).toStrictEqual(37277033);
      expect(story.time).toStrictEqual(1693084928);
      expect(story.type).toEqual("story");
      expect(story.url).toEqual(
        "https://www.mauinews.com/news/local-news/2023/08/hawaiian-electric-shares-plunge-after-utility-is-sued-over-devastating-maui-fires/"
      );
    });

    it("should return null for fake story ID from hacker-news API", async () => {
      const storyId = 84764785555;
      const story = await service.getItem(storyId);
      expect(story).toBeNull();
    });
  });

  describe("[User]:section", () => {
    it("should get exit user successfully from hacker-news API ", async () => {
      const userId = "pg_1234";
      const user = await service.getUser(userId);
      expect(user).toBeInstanceOf(Object);
      expect(user.id).toEqual("pg_1234");
      expect(user.created).toStrictEqual(1575732564);
      expect(user.karma).toBeGreaterThanOrEqual(2971);
    });

    it("should return null for fake ID from hacker-news API", async () => {
      const userId = "lol_autoTager";
      const user = await service.getUser(userId);
      expect(user).toBeNull();
    });
  });

  describe("[TopStories]:section", () => {
    it("should get top stories successfully from hacker-news API ", async () => {
      const stories = await service.getTopStories();
      expect(stories).toBeInstanceOf(Array);
      expect(stories.length).toBeGreaterThanOrEqual(200);
      expect(stories.every((item) => typeof item === "number")).toBe(true);
    });
  });
});
