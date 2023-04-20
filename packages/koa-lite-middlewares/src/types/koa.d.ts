import type { Knex } from 'knex';
import type { SSE } from '../middlewares/sse';

interface Body {
  [key: string]: any;
}

declare module 'koa' {
  interface Request {
    body: Body;
  }

  interface ExtendableContext {
    knex: Knex;
    sse:SSE
  }
}
