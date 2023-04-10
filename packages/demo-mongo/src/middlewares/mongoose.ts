import { Middleware } from 'koa';
import { connect } from 'mongoose';

export function initMongoose(url: string): Middleware {
  console.log('init mongoose');
  connect(url)
    .then(_ => {
      console.log('mongoose connected');
    })
    .catch(err => {
      console.log('mongoose connect error:', err);
    });
  return async (ctx, next) => {
    await next();
  };
}
