import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Middleware } from 'koa';

export const validator = <T extends Object>(classInstance: ClassConstructor<T>): Middleware => {
  return async (ctx, next) => {
    const query = plainToClass(classInstance, ctx.query);
    const errs = await validate(query);
    if (errs.length) {
      ctx.body = {
        code: 400,
        data: {},
        message: errs
          .map(e => e.constraints)
          .reduce((acc: string[], cur) => {
            for (const value of Object.values(cur ?? {})) {
              acc.push(value);
            }
            return acc;
          }, [])
      };
    } else {
      await next();
    }
  };
};
