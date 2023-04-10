import { Middleware } from 'koa';
import { z } from 'zod';
import { validateBody, validateQuery } from 'koa-lite-middlewares';
import { router } from '../../router';
import { CompanyRepository } from './model';

export function initCompanyRoute() {
  const prefix = 'company';

  const route = router.createRoute(prefix);

  route.post('/', validateBody(createValidator), createCompany);
  route.get('/', validateQuery(idValidator), getCompany);
  route.patch('/', validateBody(upateValidator), updateCompany);
  route.delete('/', validateQuery(idValidator), deleteCompany);

  route.get('/list', validateQuery(pageValidator), getCompanyList);
}

const createValidator = z.object({
  uuid: z.string().optional(),
  name: z.string().optional(),
  created_time: z.date().optional(),
  deleted_time: z.date().optional(),
});

const createCompany: Middleware = async (ctx, next) => {
  const companyRepo = new CompanyRepository(ctx.knex);
  ctx.body = await companyRepo.create(ctx.request.body);
  await next();
};

const idValidator = z.object({
  id: z.string()
});

const getCompany: Middleware = async (ctx, next) => {
  const query = ctx.query as any as z.infer<typeof idValidator>;
  const companyRepo = new CompanyRepository(ctx.knex);
  ctx.body = await companyRepo.findById(query.id);
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
  const companyRepo = new CompanyRepository(ctx.knex);
  ctx.body = await companyRepo.updateById(param.id, param);
  await next();
};

const deleteCompany: Middleware = async (ctx, next) => {
  const query = ctx.query as any as z.infer<typeof idValidator>;
  const companyRepo = new CompanyRepository(ctx.knex);
  ctx.body = await companyRepo.deleteById(query.id);
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

const getCompanyList: Middleware = async (ctx, next) => {
  const query = ctx.query as any as z.infer<typeof pageValidator>;
  const companyRepo = new CompanyRepository(ctx.knex);
  ctx.body = await companyRepo.getList(query.page, query.pageSize);
  await next();
};

