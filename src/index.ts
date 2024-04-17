import getRewardTokenImage from './service/getRewardTokenImage'
import image from './service/image'
import getTokenFromPlatforms from './service/getTokenFromPlatforms'
import tokenList from './service/token-list'

import { app } from './lib/hono'


app.get('/api/getRewardTokenImage/:address', getRewardTokenImage)
app.get('/api/getTokenFromPlatforms/:platform', getTokenFromPlatforms)
app.get('/api/image/:address', image)
app.get("/api/token-list/:platform", tokenList)


export default app
