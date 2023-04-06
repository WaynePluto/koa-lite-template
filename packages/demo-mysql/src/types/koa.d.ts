import { Knex } from 'knex';
import Koa from 'koa';

interface Body {
  [key: string]: any;
}

declare module 'koa' {
  interface Request {
    body: Body;
  }

  interface ExtendableContext {
    knex: Knex;
  }
}
