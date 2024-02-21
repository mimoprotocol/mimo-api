import { Hono } from 'hono'
import getRewardTokenImage from './service/getRewardTokenImage'
import image from './service/image'
import getTokenFromPlatforms from './service/getTokenFromPlatforms'

const app = new Hono()

app.get('/api/getRewardTokenImage/:address', async (c) => {
  return getRewardTokenImage(c)
})
app.get('/api/getTokenFromPlatforms/:platform', async (c) => {
  return getTokenFromPlatforms(c)
})

app.get('/api/image/:address',  async(c) => {
  return image(c)
})


export default app
