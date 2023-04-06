import type { Context, Next } from 'koa';

export function catchError() {
  return async (ctx: Context, next: Next) => {
    try {
      await next();
    } catch (error) {
      console.log('===server error:', error);

      ctx.throw(500, { error });
    }
  };
}
