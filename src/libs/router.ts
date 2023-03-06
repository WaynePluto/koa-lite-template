import { METHODS } from 'http';
import { type Middleware } from 'koa';
import compose from 'koa-compose';

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

type PathMethodFuncMap = {
  [path: string]: {
    [method: string]: Middleware[];
  };
};

type Route = {
  [key in HttpMethod]: (path: string, ...callbacks: Middleware[]) => void;
};

export default class Router {
  constructor() {}
  private routes: PathMethodFuncMap = {};
  private pathMiddlewares: PathMethodFuncMap = {};

  use(path: string, method: '*' | HttpMethod, ...middlewares: Middleware[]) {
    path = formatPath(path)
    middlewares.forEach(middleware => {
      if (!this.pathMiddlewares[path]) {
        this.pathMiddlewares[path] = {};
      }
      const middlewares = this.pathMiddlewares[path][method] || [];
      if (middlewares.length === 0) {
        middlewares.push(middleware);
      }
      this.pathMiddlewares[path][method] = middlewares;
    });
  }

  createRoute(prefix = '/') {
    const route = {} as Route;
    METHODS.forEach(method => {
      const methodKey = method.toLowerCase() as HttpMethod;
      route[methodKey] = (path, ...callbacks) => {
        prefix = formatPath(prefix);
        path = formatPath(path);
        const url = prefix + path;
        if (this.routes[url]) {
          throw new Error(`Duplicate route:${url} definitions`);
        } else {
          this.routes[url] = {
            [methodKey]: callbacks
          };
        }
      };
    });
    return route;
  }

  init(): Middleware {
    return async (ctx, next) => {
      const method = ctx.method.toLowerCase();
      const controllers = this.routes[ctx.path]?.[method] || [];
      if (!controllers.length) {
        ctx.body = `${ctx.method} ${ctx.path} Not Found`;
        return;
      }
      const commonMiddlewares = this.pathMiddlewares[ctx.path]?.['*'] || [];
      const methodMiddlewares = this.pathMiddlewares[ctx.path]?.[method] || [];
      const middlewares = [...commonMiddlewares, ...methodMiddlewares, ...controllers];
      const fn = compose(middlewares);
      await fn(ctx, next);
    };
  }
}

function formatPath(path: string) {
  path = path.startsWith('/') ? path : `/${path}`;
  path = path.endsWith('/') ? path.slice(0, -1) : path;
  return path;
}
