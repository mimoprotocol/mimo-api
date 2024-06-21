
import { cache } from "../lib/cache";
import { ethers } from "ethers";
import { config } from "../config";

export const getTokenFromPlatforms = async (platform: string) => {
    const value = await cache.getOrSet(
      `getTokenFromPlatforms-${platform}`,
      async () => {
        console.time('getTokenFromPlatforms')
        let r = await fetch(config.ioPayGraphAPIURL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            query: `{
          token_list_v3(where: { platforms: { _has_key: "${platform}" } }, order_by: { market_cap: desc_nulls_last }, limit: 1000) {
            id
            logo
            name
            address:platforms(path: "${platform}")
            symbol
            current_price
            market_cap
            decimals(path:"${platform}")
            is_depin_token
            tags
          }
        }`,
          }),
        });
        let data = await r.json();
        const token_list_v3 = data.data.token_list_v3;
        let arr: any [] = [];
        token_list_v3.forEach((i: any) => {
          if (
            i.address &&
            ethers.utils.isAddress(i.address) &&
            i.address != "0x0000000000000000000000000000000000001010"
          )
            arr.push(i);
        });
        console.timeEnd('getTokenFromPlatforms')
        return arr;
      },
       {
        ttl: 10 * 1000
       }
    );
    return value
  };