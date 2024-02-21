import { getTokenFromPlatforms } from "../lib/token";


export default async function handler(context:any) {
  try {
    const { req, res } = context;
    const { platform } = req.param();
    const arr = await getTokenFromPlatforms(platform)
    return context.json(arr);
  } catch (err) {
    return context.json([]);
  }
}