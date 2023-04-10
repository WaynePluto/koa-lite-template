import { Middleware } from 'koa';
import { router } from '../../router';

export function initRoute() {
  const prefix = 'template';
  router.use(prefix, '*', () => {});
  router.use(prefix + '/list', 'get', () => {});
  const route = router.createRoute(prefix);
  route.get('/', handle);
}

const handle: Middleware = async (ctx, next) => {
  await next();
};
