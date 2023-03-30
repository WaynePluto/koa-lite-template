import { Middleware } from 'koa';
import { z } from 'zod';
import { DI } from '../../../di';

export const addUserValidator = z.object({
  name: z.string()
});

type AddUserQuery = z.infer<typeof addUserValidator>;

export const addUser: Middleware = async (ctx, next) => {
  const query: AddUserQuery = ctx.query as any;
  const db = DI.db;
  const result = await db('users').insert({ name: query.name });
  const user = await db('users').where({ id: result[0] }).first();
  ctx.body = user;
  await next();
};
