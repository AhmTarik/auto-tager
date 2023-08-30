import { Injectable, Scope } from "@nestjs/common";
import { UserCacheService } from "./user-cache.service";
import { StoryRepository } from "../repository/story.repository";
import { Logger } from "../logger/logger.decorator";
import { LoggerService } from "../logger/logger.service";
import { doInParallel } from "../helper/utils";
import { Story } from "models/story.model";

@Injectable({ scope: Scope.REQUEST })
export class StoryService {
  constructor(
    @Logger("StoryService") private logger: LoggerService,
    private readonly storyRepository: StoryRepository,
    private readonly userCacheService: UserCacheService
  ) {}

  /**
   * Finds the top 10 most occurring words in an array of strings.
   *
   * @param {Story[]} stories - An array of strings to process.
   * @param {number} count - specefic the .
   * @returns {top:{Array<{ word: string, count: number }>,titles:string[]}} An array of objects containing
   *          the top occurring words and their occurrence counts.
   */
  findTopWords(
    stories: Story[],
    count = 10
  ): {
    top: {
      word: any;
      count: any;
    }[];
    titles: string[];
    ids: number[];
  } {
    const stopWords = new Set([
      "the",
      "and",
      "of",
      "to",
      "but",
      "in",
      "a",
      "its",
      "an",
      "is",
      "that",
      "it",
      "with",
      "for",
      "as",
      "on",
      "was",
      "not",
      "at",
      "by",
      "this",
      "from",
      "are",
      "you",
      "i",
      "than",
      "have",
      "how",
      "your",
      "what",
      "can",
      "more",
      "no",
      "yes",
      "after",
      "has",
      "using",
      // Add more stop words as needed
    ]);

    const wordCountMap = new Map();

    // Loop through each string in the array
    stories.forEach((story) => {
      const words = story.title.toLowerCase().split(/\s+/); // Split string into words
      words.forEach((word) => {
        // Clean the word by removing non-alphabetical characters
        const cleanedWord = word.replace(/[^a-z]/g, "");

        if (cleanedWord.length >= 2 && !stopWords.has(cleanedWord)) {
          // Count the occurrences of each cleaned word
          if (wordCountMap.has(cleanedWord)) {
            wordCountMap.set(cleanedWord, wordCountMap.get(cleanedWord) + 1);
          } else {
            wordCountMap.set(cleanedWord, 1);
          }
        }
      });
    });

    // Convert wordCountMap to an array of objects
    const wordCountArray = Array.from(wordCountMap.entries()).map(
      ([word, count]) => ({ word, count })
    );

    // Sort the array by word count in descending order
    wordCountArray.sort((a, b) => b.count - a.count);

    return {
      top: wordCountArray.slice(0, count),
      titles: stories.map((x) => x.title),
      ids: stories.map((x) => x.id),
    };
  }

  /**
   * Find the top 10 most occurring words in the titles of the last 25 stories
   * @returns A promise that resolves to an array containing the top occurring words
   *          along with their occurrence counts.
   * @throws {Error} If an error occurs during data retrieval or processing.
   */
  async topWordsLastStories(): Promise<any> {
    const topStoryIds = await this.storyRepository.getTopStories();
    const last25StoryIds = topStoryIds.slice(0, 25);

    const last25Stories = [];
    await doInParallel(last25StoryIds, async (item) => {
      const story = await this.storyRepository.getItem(item);
      if (story) last25Stories.push(story);
    });
    return this.findTopWords(last25Stories);
  }
  /**
   * Find the top 10 most occurring words in the titles of the post of exactly the last week
   * @returns A promise that resolves to an array containing the top occurring words
   *          along with their occurrence counts.
   * @throws {Error} If an error occurs during data retrieval or processing.
   */
  async topWordsLastWeek(): Promise<any> {
    const oneWeekAgo = new Date(
      (Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60) * 1000
    );

    const topStoryIds = await this.storyRepository.getTopStories();

    const lastWeekStories = [];
    await doInParallel(topStoryIds, async (storyId) => {
      const story = await this.storyRepository.getItem(storyId);
      if (story) {
        const storyDate = new Date(story.time * 1000);
        if (storyDate >= oneWeekAgo) lastWeekStories.push(story);
      }
    });

    return this.findTopWords(lastWeekStories);
  }

  /**
   * Retrieves the top 10 most occurring words in titles of the last 600 stories
   * posted by users with at least a specified amount of karma.
   * @param karma - The minimum karma required for a user to be considered.
   * @returns A promise that resolves to an array containing the top occurring words
   *          along with their occurrence counts.
   * @throws {Error} If an error occurs during data retrieval or processing.
   */
  async topWordsWithHighKarma(karma: number): Promise<any> {
    const topStoryIds = await this.storyRepository.getTopStories();
    const last600StoryIds = topStoryIds.slice(0, 600);

    const last600Stories = [];
    await doInParallel(last600StoryIds, async (item) => {
      const story = await this.storyRepository.getItem(item);
      if (story) last600Stories.push(story);
    });

    const userIds = last600Stories.map((story) => story.by);
    await doInParallel(userIds, async (userId) => {
      let user = await this.userCacheService.getUser(userId);
      if (!user) {
        user = await this.storyRepository.getUser(userId);
        this.userCacheService.setUser(userId, user);
      }
    });

    const karmaUsers = [];
    const filterHighKarmaUserStories = last600Stories.filter((story) => {
      if (story.by) {
        const user = this.userCacheService.getUser(story.by);
        if (user && user.karma >= karma)
          karmaUsers.push({ name: user.id, karma: user.karma });
        return user && user.karma >= karma;
      }
    });

    return this.findTopWords(filterHighKarmaUserStories);
  }
}
