import { caching } from 'cache-manager';

export const getMemoryCache = async () =>  caching('memory', {
    max: 10000,
    ttl: 10 * 1000 /*milliseconds*/,
    refreshThreshold: 3 * 1000
  });
  
