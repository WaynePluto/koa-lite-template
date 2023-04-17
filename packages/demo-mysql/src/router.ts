import Router from 'koa-lite-router';
import { initCompanyRoute } from './modules/company/controller';
import { initUserRoute } from './modules/user/controller';

export const router = new Router();

export default function initRouter() {
  initUserRoute(router);
  initCompanyRoute(router);

  // other routes...
  return router.init();
}
