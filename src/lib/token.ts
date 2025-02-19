import { cache } from "../lib/cache";

export const getTokenFromPlatforms = async (platform: string) => {
  const value = await cache.getOrSet(
    `getTokenFromPlatforms-${platform}`,
    async () => {
      let r = await fetch("https://api.iopay.me/api/rest/token_list/iotex", {
        method: "GET",
      });
      let data = await r.json();
      return data.token_list_v4.map((item) => {
        return {
          id: item.id,
          logo: item.logo,
          name: item.name,
          address: item.address,
          symbol: item.symbol,
          current_price: item.current_price,
          market_cap: item.market_cap,
          decimals: item.decimals,
          is_depin_token: item.is_depin_token,
          tags: item.tags,
          logoURI: item.logo,
        };
      }).filter((item: any) => item.logo);
    },
    {
      ttl: 10 * 1000,
    }
  );
  return value;
};
