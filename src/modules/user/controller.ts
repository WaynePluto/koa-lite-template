import { Middleware } from 'koa';
import { z } from 'zod';
import { validateBody, validateQuery } from '../../middlewares/validator';
import { router } from '../../router';
import { UserRepository } from './model';

export function initUserRoute() {
  const prefix = 'user';
  router.use(prefix, '*', middlewares);

  const route = router.createRoute(prefix);

  route.post('/', validateBody(createValidator), createUser);
  route.get('/', validateQuery(idValidator), getUser);
  route.patch('/', validateBody(upateValidator), updateUser);
  route.delete('/', validateQuery(idValidator), deleteUser);

  route.get('/list', getUserList);
}

const repo = {
  userRepo: null as UserRepository | null
};

const middlewares: Middleware = async (ctx, next) => {
  if (!repo.userRepo) {
    repo.userRepo = new UserRepository(ctx.knex);
  }
  await next();
};

const createValidator = z.object({
  uuid: z.string().optional(),
  openid: z.string().optional(),
  unionid: z.string().optional(),
  name: z.string().optional(),
  created_time: z.date().optional(),
});
const createUser: Middleware = async (ctx, next) => {
  ctx.body = await repo.userRepo?.create(ctx.request.body);
  await next();
};

const idValidator = z.object({
  id: z.string()
});

const getUser: Middleware = async (ctx, next) => {
  const query = ctx.query as any as z.infer<typeof idValidator>;
  ctx.body = await repo.userRepo?.findById(query.id);
  await next();
};

const upateValidator = z.object({
  id: z.number(),
  uuid: z.string().optional(),
  openid: z.string().optional(),
  unionid: z.string().optional(),
  name: z.string().optional(),
  created_time: z.date().optional(),
});
const updateUser: Middleware = async (ctx, next) => {
  const param = ctx.request.body as any as z.infer<typeof upateValidator>;
  ctx.body = await repo.userRepo?.updateById(param.id, param);
  await next();
};

const deleteUser: Middleware = async (ctx, next) => {
  const query = ctx.query as any as z.infer<typeof idValidator>;
  ctx.body = await repo.userRepo?.deleteById(query.id);
  await next();
};

const getUserList: Middleware = async (ctx, next) => {
  ctx.body = await repo.userRepo?.getList();
  await next();
};

