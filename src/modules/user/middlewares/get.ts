import { Middleware } from 'koa';
import { z } from 'zod';
import { DI } from '../../../di';

export const getUserValidator = z.object({
  id: z.string()
});

type Query = z.infer<typeof getUserValidator>;

export const getUser: Middleware = async (ctx, next) => {
  const query: Query = ctx.query as any;
  const db = DI.db;
  const user = await db('users').where({ id: query.id }).first();
  ctx.body = { code: 200, data: user };
  await next();
};
