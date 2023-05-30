import Koa from 'koa'
import initRouter from './router'
import { bodyParseJSON, catchError } from 'koa-lite-middlewares'
import { createKoaMiddleware } from './middlewares/trpc-koa-adaptor'
import { appRouter } from './trpc-router'

const app = new Koa()

app.use(catchError())

// use trpc, next middlewares will not work if router enter this trpc middleware
app.use(createKoaMiddleware({ router: appRouter, prefix: '/trpc' }))

// other router middlewares
app.use(bodyParseJSON())
app.use(initRouter())

app.listen(3000, () => {
  console.log('Server is running at http://127.0.0.1:3000/')
})
