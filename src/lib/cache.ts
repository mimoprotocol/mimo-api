import { MemoryCache, caching } from "cache-manager";
import { BentoCache, bentostore } from 'bentocache';

//@ts-ignore
import { memoryDriver } from 'bentocache/drivers/memory';

// export const getMemoryCache: {
//   cache?: MemoryCache;
//   (): Promise<MemoryCache>;
// } = async () => {
//   if (!getMemoryCache.cache) {
//     const cache = await caching("memory", {
//       max: 10000,
//       ttl: 10 * 1000 /*milliseconds*/,
//       // refreshThreshold: 3 * 1000,x
//     });
//     getMemoryCache.cache = cache;
//   }
//   return getMemoryCache.cache
// };



export const cache =
  new BentoCache({
    default: 'memory',
    stores: {
      memory: bentostore()
        .useL1Layer(memoryDriver({ maxItems: 10000, maxSize: 10_000_000 }))
        // .useL2Layer(
        //   redisDriver({
        //     connection: new Redis(REDIS_URL),
        //   }),
        // ),
    },
    timeouts: {
      soft: '100ms',
      hard: '3s'
    },
    ttl: "1m",
    earlyExpiration: 0.8,
    gracePeriod: {
      enabled: true,
      duration: '24h',
      fallbackDuration: '1m',
    },
  });
