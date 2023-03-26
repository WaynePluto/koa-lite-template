import Koa from 'koa';

declare module 'koa' {
  interface Body {
    [key: string]: any;
  }

  interface Request {
    body: Body;
  }

  interface BodyParserContext extends Koa.Context {
    request: {
      body: Body;
    };
  }
}
