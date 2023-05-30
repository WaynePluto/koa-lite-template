import { METHODS } from 'http'
import { type Middleware } from 'koa'
import compose from 'koa-compose'

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

type PathMethodFuncMap = {
  [path: string]: {
    [method: string]: Middleware[]
  }
}
/** http方法、中间件字典 */
type MethodMiddlewareMap = Map<RegExp, Middleware[]>

/** 路由、方法字典 */
type PathMethodMap = Map<RegExp, MethodMiddlewareMap>

/** 局部路由 */
type Route = {
  [key in HttpMethod]: (path: string, ...callbacks: Middleware[]) => void
}

export default class Router {
  /** 局部路由，添加的中间件，精确匹配路径与请求方法 */
  private routeMiddlewares: PathMethodFuncMap = {}
  /** 全局路由对象添加的中间件，正则匹配路径 */
  private regPathMiddlewares: PathMethodMap = new Map()

  use(reg: RegExp = /.*/, method: RegExp = /.*/, ...middlewares: Middleware[]) {
    const regMidMap = this.regPathMiddlewares.get(reg)
    if (regMidMap) {
      const methodMids = regMidMap.get(method)
      if (methodMids) {
        methodMids.push(...middlewares)
      } else {
        regMidMap.set(method, middlewares)
      }
    } else {
      const regMap: MethodMiddlewareMap = new Map()
      const methodMids: Middleware[] = middlewares
      regMap.set(method, methodMids)
      this.regPathMiddlewares.set(reg, regMap)
    }
  }

  createRoute(prefix = '/') {
    const route = {} as Route
    METHODS.forEach(method => {
      const methodKey = method.toLowerCase() as HttpMethod
      route[methodKey] = (path, ...callbacks) => {
        prefix = formatPath(prefix)
        path = formatPath(path)
        const url = prefix + path
        if (this.routeMiddlewares[url]) {
          if (this.routeMiddlewares[url][methodKey]) {
            throw new Error(`Duplicate route:${url} definitions`)
          } else {
            this.routeMiddlewares[url][methodKey] = callbacks
          }
        } else {
          this.routeMiddlewares[url] = {
            [methodKey]: callbacks
          }
        }
      }
    })
    return route
  }

  init(): Middleware {
    return async (ctx, next) => {
      const method = ctx.method.toLowerCase()
      const controllers = this.routeMiddlewares[ctx.path]?.[method] || []
      if (!controllers.length) {
        ctx.body = `${ctx.method} ${ctx.path} Not Found`
        return
      }
      const regMids: Middleware[] = []

      this.regPathMiddlewares.forEach((methodMap, pathReg) => {
        if (pathReg.test(ctx.path)) {
          methodMap.forEach((mids, methodReg) => {
            if (methodReg.test(method)) {
              regMids.push(...mids)
            }
          })
        }
      })

      const middlewares = [...regMids, ...controllers]
      const fn = compose(middlewares)
      await fn(ctx, next)
    }
  }
}

function formatPath(path: string) {
  path = path.startsWith('/') ? path : `/${path}`
  path = path.endsWith('/') ? path.slice(0, -1) : path
  return path
}
