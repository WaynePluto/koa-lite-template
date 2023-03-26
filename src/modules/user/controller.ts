import { Middleware } from 'koa';
import { validateQuery } from '../../middlewares/validator';
import { router } from '../../router';
import { UserRepository } from './model';
import { type AddUserQuery, addUserValidator } from './validator/add.validator';

export function initUserRoute() {
  const prefix = 'user';
  router.use(prefix, '*', middlewares);
  const route = router.createRoute(prefix);
  route.get('/', getUsers);
  route.post('/', validateQuery(addUserValidator), addUser);
  route.get('/info', getUserInfo);
}

const middlewares: Middleware = async (ctx, next) => {
  await next();
};

const addUser: Middleware = async (ctx, next) => {
  const query: AddUserQuery = ctx.query as any;
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
