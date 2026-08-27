import getRewardTokenImage from './service/getRewardTokenImage'
import image from './service/image'
import getTokenFromPlatforms from './service/getTokenFromPlatforms'
import tokenList from './service/token-list'

import { app } from './lib/hono'


// This runs as PID 1 in the container (ENTRYPOINT ["bun", "src/index.ts"], no
// init), and the kernel discards a signal PID 1 has no handler for. Without this,
// `docker stop` did nothing and the daemon SIGKILLed us 10s later — nginx served
// that stall as 502s on every deploy and host restart.
for (const signal of ['SIGTERM', 'SIGINT'] as const) {
  process.on(signal, () => process.exit(0))
}


app.get('/api/getRewardTokenImage/:address', getRewardTokenImage)
app.get('/api/getTokenFromPlatforms/:platform', getTokenFromPlatforms)
app.get('/api/image/:address', image)
app.get("/api/token-list/:platform", tokenList)


export default app
