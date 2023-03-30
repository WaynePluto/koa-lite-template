import { Middleware } from 'koa';
import { validateQuery } from '../../middlewares/validator';
import { router } from '../../router';
import { addUser, addUserValidator } from './middlewares/add';
import { getUserValidator, getUser } from './middlewares/get';

export function initUserRoute() {
  const prefix = 'user';
  // router.use(prefix, '*', middlewares);
  const route = router.createRoute(prefix);
  route.get('/', validateQuery(getUserValidator), getUser);
  route.post('/', validateQuery(addUserValidator), addUser);
}
