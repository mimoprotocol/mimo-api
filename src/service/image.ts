import _ from "lodash";
import { getMemoryCache } from "../lib/cache";
import { getTokenFromPlatforms } from "../lib/token";

export default async function handler(context: any) {
  const { req, res } = context;
  const { address } = req.param();
  const memoryCache = await getMemoryCache();
  try {
    if (address) {
      const image = await memoryCache.wrap(
        `image-${address}`,
        async () => {
          const rs = await getTokenFromPlatforms("iotex");
          const tokenList = rs;
          const addressMap = _.keyBy(tokenList, "address");
          const token = addressMap[address.toLowerCase()];
          const image = token?.logo || "";
          return image;
        },
        60 * 60 * 24
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
