import { Injectable, Scope } from "@nestjs/common";

@Injectable({ scope: Scope.DEFAULT })
export class CustomConfigService {
  public hackerNewsApiBaseUrl: string;
  public apiPrefix: string;

  constructor() {
    this.hackerNewsApiBaseUrl =
      process.env.HACKER_NEWS_BASE_URL ||
      "https://hacker-news.firebaseio.com/v0";
  }
}
