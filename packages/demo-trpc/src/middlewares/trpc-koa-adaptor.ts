import { AnyRouter } from '@trpc/server'
import {
  NodeHTTPHandlerOptions,
  NodeHTTPRequest,
  NodeHTTPResponse,
  nodeHTTPRequestHandler
} from '@trpc/server/adapters/node-http'
import { Middleware } from 'koa'

export function createKoaMiddleware<TRouter extends AnyRouter>(
  opts: NodeHTTPHandlerOptions<TRouter, NodeHTTPRequest, NodeHTTPResponse> & { prefix: string }
): Middleware {
  return async (ctx, next) => {
    const { prefix = '' } = opts
    if (prefix && !ctx.path.startsWith(prefix)) {
      await next()
      return
    }
    const endpoint = ctx.path.slice(prefix.length + 1)
    ctx.status = 200
    await nodeHTTPRequestHandler({
      ...opts,
      req: ctx.req,
      res: ctx.res,
      path: endpoint
    })
  }
}
