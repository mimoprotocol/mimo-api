import { MemoryCache, caching } from "cache-manager";

export const getMemoryCache: {
  cache?: any;
  (): Promise<MemoryCache>;
} = async () => {
  if (!getMemoryCache.cache) {
    const cache = await caching("memory", {
      max: 10000,
      ttl: 10 * 1000 /*milliseconds*/,
      refreshThreshold: 3 * 1000,
    });
    getMemoryCache.cache = cache;
  }
  return getMemoryCache.cache
};
