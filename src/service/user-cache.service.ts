import { Injectable, Scope } from "@nestjs/common";
import { User } from "models/user.model";

@Injectable({ scope: Scope.DEFAULT })
/**
 * A service for managing user data caching.
 */
export class UserCacheService {
  private userIndex = new Map<string, User>();

  /**
   * Set or update user data in the cache.
   *
   * @param userId - The unique identifier of the user.
   * @param userData - The data associated with the user.
   */
  setUser(userId: string, userData: any) {
    if (userId && userData) this.userIndex.set(userId, userData);
  }

  /**
   * Get user data from the cache based on the user's identifier.
   *
   * @param userId - The unique identifier of the user.
   * @returns The user data if found, or `null` if not found.
   */
  getUser(userId: string): User | null {
    let _user = this.userIndex.get(userId);
    return _user;
  }
}
