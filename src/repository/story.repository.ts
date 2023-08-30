import { HttpService } from "@nestjs/axios";
import { Injectable, Scope } from "@nestjs/common";
import { Story } from "../models/story.model";
import { User } from "../models/user.model";
import { BaseRepository } from "./base.repository";
import { firstValueFrom } from "rxjs";
import { CustomConfigService } from "../config";

@Injectable({ scope: Scope.REQUEST })
export class StoryRepository extends BaseRepository {
  constructor(
    private readonly config: CustomConfigService,
    protected readonly httpService: HttpService
  ) {
    super(httpService);
  }

  /**
   * Returns the current top 500 stories from hacker news API.
   * @returns {number[]} Array of story Id's
   */
  async getTopStories(): Promise<number[]> {
    try {
      const url = `${this.config.hackerNewsApiBaseUrl}/topstories.json`;

      return firstValueFrom<number[]>(this.get<number[]>(url));
    } catch (error) {
      throw new Error(
        `('[StoryRepository getTopStories:error]: ${error.message}`
      );
    }
  }

  /**
   * Get the Item (story, comment, jobs, Ask HN, etc) from hacker news API
   * @param itemId storyId, commentId
   * @returns {Story} Story
   */
  async getItem(itemId: number): Promise<Story> {
    try {
      const url = `${this.config.hackerNewsApiBaseUrl}/item/${itemId}.json`;

      return firstValueFrom<Story>(this.get<Story>(url));
    } catch (error) {
      throw new Error(`('[StoryRepository getItem:error]: ${error}`);
    }
  }

  /**
   * Get user by id from hacker news API
   * @param userId
   * @returns {User} User
   */
  async getUser(userId: string): Promise<User> {
    try {
      const url = `${this.config.hackerNewsApiBaseUrl}/user/${userId}.json`;

      return firstValueFrom(this.get<User>(url));
    } catch (error) {
      throw new Error(`('[StoryRepository getUser:error]: ${error.message}`);
    }
  }
}
