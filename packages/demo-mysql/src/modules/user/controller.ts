import { Middleware } from 'koa';
import { z } from 'zod';
import { validateBody, validateQuery } from 'koa-lite-middlewares';
import type Router from 'koa-lite-router'
import { UserRepository } from './model';

export function initUserRoute(router: Router) {
  const prefix = 'user';

  const route = router.createRoute(prefix);

  route.post('/', validateBody(createValidator), createUser);
  route.get('/', validateQuery(idValidator), getUser);
  route.patch('/', validateBody(upateValidator), updateUser);
  route.delete('/', validateQuery(idValidator), deleteUser);

  route.get('/list', validateQuery(pageValidator), getUserList);
}

const createValidator = z.object({
  uuid: z.string().optional(),
  openid: z.string().optional(),
  unionid: z.string().optional(),
  name: z.string().optional(),
  created_time: z.date().optional(),
});

const createUser: Middleware = async (ctx, next) => {
  const userRepo = new UserRepository(ctx.knex);
  ctx.body = await userRepo.create(ctx.request.body);
  await next();
};

const idValidator = z.object({
  id: z.string()
});

const getUser: Middleware = async (ctx, next) => {
  const query = ctx.query as any as z.infer<typeof idValidator>;
  const userRepo = new UserRepository(ctx.knex);
  ctx.body = await userRepo.findById(query.id);
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
  const userRepo = new UserRepository(ctx.knex);
  ctx.body = await userRepo.updateById(param.id, param);
  await next();
};

const deleteUser: Middleware = async (ctx, next) => {
  const query = ctx.query as any as z.infer<typeof idValidator>;
  const userRepo = new UserRepository(ctx.knex);
  ctx.body = await userRepo.deleteById(query.id);
  await next();
};

const pageValidator = z.object({
  page: z
    .string()
    .transform(val => Number(val))
    .refine(val => val > 0, 'page has to be greater than 0'),
  pageSize: z
    .string()
    .transform(val => Number(val))
    .refine(val => val > 0, 'pageSize has to be greater than 0')
});

const getUserList: Middleware = async (ctx, next) => {
  const query = ctx.query as any as z.infer<typeof pageValidator>;
  const userRepo = new UserRepository(ctx.knex);
  ctx.body = await userRepo.getList(query.page, query.pageSize);
  await next();
};

