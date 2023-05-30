import Router from 'koa-lite-router';
import { initUserRoute } from './modules/user/controller';

export const router = new Router();

export default function initRouter({ exclude }: { exclude: string }) {
  initUserRoute(router);
  console.log('===inited router===');
  // other routes...
  return router.init({ exclude });
}
