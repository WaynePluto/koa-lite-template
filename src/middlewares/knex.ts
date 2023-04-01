import knex from 'knex';
import { Context, Next } from 'koa';

export default function initKnex(config: any) {
  const db = knex(config);
  return async (ctx: Context, next: Next) => {
    ctx.knex = db;
    await next();
  };
}
