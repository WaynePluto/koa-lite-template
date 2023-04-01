import { Middleware } from 'koa';
import { z } from 'zod';
import { validateBody, validateQuery } from '../../middlewares/validator';
import { router } from '../../router';
import { CompanyRepository } from './model';

export function initCompanyRoute() {
  const prefix = 'company';
  router.use(prefix, '*', middlewares);

  const route = router.createRoute(prefix);

  route.post('/', validateBody(createValidator), createCompany);
  route.get('/', validateQuery(idValidator), getCompany);
  route.patch('/', validateBody(upateValidator), updateCompany);
  route.delete('/', validateQuery(idValidator), deleteCompany);

  route.get('/list', getCompanyList);
}

const repo = {
  companyRepo: null as CompanyRepository | null
};

const middlewares: Middleware = async (ctx, next) => {
  if (!repo.companyRepo) {
    repo.companyRepo = new CompanyRepository(ctx.knex);
  }
  await next();
};

const createValidator = z.object({
  uuid: z.string().optional(),
  name: z.string().optional(),
  created_time: z.date().optional(),
  deleted_time: z.date().optional(),
});
const createCompany: Middleware = async (ctx, next) => {
  ctx.body = await repo.companyRepo?.create(ctx.request.body);
  await next();
};

const idValidator = z.object({
  id: z.string()
});

const getCompany: Middleware = async (ctx, next) => {
  const query = ctx.query as any as z.infer<typeof idValidator>;
  ctx.body = await repo.companyRepo?.findById(query.id);
  await next();
};

const upateValidator = z.object({
  id: z.number(),
  uuid: z.string().optional(),
  name: z.string().optional(),
  created_time: z.date().optional(),
  deleted_time: z.date().optional(),
});
const updateCompany: Middleware = async (ctx, next) => {
  const param = ctx.request.body as any as z.infer<typeof upateValidator>;
  ctx.body = await repo.companyRepo?.updateById(param.id, param);
  await next();
};

const deleteCompany: Middleware = async (ctx, next) => {
  const query = ctx.query as any as z.infer<typeof idValidator>;
  ctx.body = await repo.companyRepo?.deleteById(query.id);
  await next();
};

const getCompanyList: Middleware = async (ctx, next) => {
  ctx.body = await repo.companyRepo?.getList();
  await next();
};

