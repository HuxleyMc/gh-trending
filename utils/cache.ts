/*
    A class the manages a simple cache
    If the item is not in the cache, it will be fetched and added to the cache
    If the item is in the cache, check if it is stale and refetch if it is
    If the item is in the cache and not stale, return the cached item
*/

import { CACHE_MAX_AGE } from "@/constants";
import { Repo, Developer } from "@/types";

interface CacheItem {
  key: string;
  value: Repo[] | Developer[];
  lastUpdated: number;
}

export class Cache {
  private cache = new Map<string, CacheItem>();

  // Max age in seconds
  private maxAge: number = CACHE_MAX_AGE;

  async set(key: string, results: Repo[] | Developer[]) {
    this.clearIfTooLarge();

    this.cache.set(key, {
      key,
      value: results,
      lastUpdated: Date.now(),
    });
  }

  get(key: string) {
    const cachedItem = this.cache.get(key);

    if (!cachedItem || this.checkStale(cachedItem.lastUpdated)) {
      console.log("Cache miss: ", key);
      return null;
    }

    return cachedItem.value;
  }

  private checkStale = (lastUpdated: number) => {
    const now = Date.now();
    const diff = now - lastUpdated;
    const diffInSeconds = diff / 1000;
    const isStale = diffInSeconds > this.maxAge;
    // Check if the lastUpdated was a previous day
    const isPreviousDay =
      new Date(now).getDate() !== new Date(lastUpdated).getDate();
    return isStale || isPreviousDay;
  };

  private clearIfTooLarge = () => {
    if (this.cache.size > 10) {
      this.cache.clear();
    }
  };
}

export const cacheInstance = new Cache();
