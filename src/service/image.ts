import _ from "lodash";
import { getTokenFromPlatforms } from "../lib/token";
import { cache } from "../lib/cache";

export default async function handler(context: any) {
  const { req, res } = context;
  const { address } = req.param();
  try {
    if (address) {
      const image = await cache.getOrSet(
        `image-${address}`,
        async () => {
          const rs = await getTokenFromPlatforms("iotex");
          const tokenList = rs;
          const addressMap = _.keyBy(tokenList, "address");
          const token = addressMap[address.toLowerCase()];
          const image = token?.logo || "";
          return image;
        },
        {
          ttl: 60*1000
        }
      );
      if (image) {
        return context.redirect(image);
      } else {
        context.status(404);
        return context.text("Not found");
      }
    } else {
      context.status(400);
      return context.text("Bad Request: address is required");
    }
  } catch (err: any) {
    context.status(400);
    return context.text(err.message);
  }
}
