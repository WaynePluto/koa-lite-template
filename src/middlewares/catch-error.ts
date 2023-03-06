import type { Context, Next } from 'koa';

export default function catchError() {
  return async (ctx: Context, next: Next) => {
    try {
      await next();
    } catch (error) {
      console.log('error:', error);
      ctx.throw(500);
    }
  };
}
