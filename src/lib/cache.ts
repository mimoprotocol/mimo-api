import { caching } from 'cache-manager';

export const getMemoryCache = async () =>  caching('memory', {
    max: 100,
    ttl: 10 * 1000 /*milliseconds*/,
  });
  