import { Middleware } from 'koa';
import { validator } from '../../middlewares/validator';
import { router } from '../../router';
import { UserRepository } from './model';
import { AddUserQuery } from './validator/add.validator';

export function initUserRoute() {
  const prefix = 'user';
  router.use(prefix, '*', middlewares);
  const route = router.createRoute(prefix);
  route.get('/', getUsers);
  route.post('/', validator(AddUserQuery), addUser)
  route.get('/info', getUserInfo);
}

const middlewares: Middleware = async (ctx, next) => {
  await next();
};

const addUser: Middleware = async (ctx, next) => {
  const query = ctx.query as any as AddUserQuery;
  ctx.body = { code: 1, data: { name: query.name } };
  await next();
};

const getUsers: Middleware = async (ctx, next) => {
  const userRepo = new UserRepository();
  const list = await userRepo.getAll();
  ctx.body = { code: 1, data: list };
  await next();
};

const getUserInfo: Middleware = async (ctx, next) => {
  ctx.body = { code: 1, data: `User:${ctx.query['id']} info` };
  await next();
};
