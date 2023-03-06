import { Middleware } from 'koa';
import { router } from '../../router';
import { UserRepository } from './model';

export function initUserRoute() {
  const prefix = 'user'
  router.use(prefix, '*', middlewares);
  const route = router.createRoute(prefix);
  route.get('/', getUsers);
  route.get('/info', getUserInfo);
}


const middlewares: Middleware = async (ctx, next) => {
  await next();
};

const getUsers: Middleware = async (ctx, next) => {
  const userRepo = new UserRepository()
  const list = await userRepo.getAll()
  ctx.body = { code: 1, data: list };
  await next();
};

const getUserInfo: Middleware = async (ctx, next) => {
  ctx.body = { code: 1, data: `User:${ctx.query['id']} info` };
  await next();
};

