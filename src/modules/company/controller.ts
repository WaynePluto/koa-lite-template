import { Middleware } from 'koa';
import { router } from '../../router';
import { CompanyRepository } from './model';

export function initCompanyRoute() {
  const prefix = 'company'
  router.use(prefix, '*', middlewares);
  const route = router.createRoute(prefix);
  route.get('/', getCompanies);
  route.get('/info', getCompanyInfo);
}


const middlewares: Middleware = async (ctx, next) => {
  await next();
};

const getCompanies: Middleware = async (ctx, next) => {
  const companyRepo = new CompanyRepository()
  const list = await companyRepo.getAll()
  ctx.body = { code: 1, data: list };
  await next();
};

const getCompanyInfo: Middleware = async (ctx, next) => {
  ctx.body = { code: 1, data: `company:${ctx.query['id']} info` };
  await next();
};

