import { Middleware } from 'koa'
import { validateBody, validateQuery } from 'koa-lite-middlewares'
import type Router from 'koa-lite-router'
import { z } from 'zod'

export function initUserRoute(router: Router) {
  const prefix = 'user'

  router.use(/^\/user/, undefined, initUserRepo)

  const route = router.createRoute(prefix)

  route.post('/', validateBody(createValidator), createUser)
  route.get('/', validateQuery(idValidator), getUser)
  route.patch('/', validateBody(upateValidator), updateUser)
  route.delete('/', validateQuery(idValidator), deleteUser)

  route.get('/list', getUserList)
}

const initUserRepo: Middleware = async (ctx, next) => {
  console.log('====init user repo===')
  await next()
}

const createValidator = z.object({
  uuid: z.string().optional(),
  openid: z.string().optional(),
  unionid: z.string().optional(),
  name: z.string().optional(),
  created_time: z.date().optional()
})
const createUser: Middleware = async (ctx, next) => {
  ctx.body = 'createUser'
  await next()
}

const idValidator = z.object({
  id: z.string()
})

const getUser: Middleware = async (ctx, next) => {
  ctx.body = `get user:${ctx.query.id}`
  await next()
}

const upateValidator = z.object({
  id: z.number(),
  uuid: z.string().optional(),
  openid: z.string().optional(),
  unionid: z.string().optional(),
  name: z.string().optional(),
  created_time: z.date().optional()
})
const updateUser: Middleware = async (ctx, next) => {
  const param = ctx.request.body as any as z.infer<typeof upateValidator>
  ctx.body = { msg: 'update user', data: param }
  await next()
}

const deleteUser: Middleware = async (ctx, next) => {
  const query = ctx.query as any as z.infer<typeof idValidator>
  ctx.body = `deleteUser:${query.id}`
  await next()
}

const getUserList: Middleware = async (ctx, next) => {
  ctx.body = 'get user list'
  await next()
}
