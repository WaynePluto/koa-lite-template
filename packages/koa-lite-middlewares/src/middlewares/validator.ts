import { Middleware } from 'koa';
import { ZodType } from 'zod';

export const validateQuery = <T extends ZodType>(data: T): Middleware => {
  return async (ctx, next) => {
    const res = await data.safeParseAsync(ctx.query)
    if(res.success){
      await next()
    }else{
      ctx.body = res.error
    }
  };
};
export const validateBody=<T extends ZodType>(data: T): Middleware => {
  return async (ctx, next) => {
    const res = await data.safeParseAsync(ctx.request.body)
    if(res.success){
      await next()
    }else{
      ctx.body = res.error
    }
  };
};