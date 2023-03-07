import { Middleware } from 'koa';
import { router } from '../../router';
import { UserRepository } from './model';
import joi, { type ValidationError} from 'joi'

export function initUserRoute() {
  const prefix = 'user'
  router.use(prefix, '*', middlewares);
  const route = router.createRoute(prefix);
  route.get('/', getUsers);
  route.post('/', addUserValidator, addUser)
  route.get('/info', getUserInfo);
}


const middlewares: Middleware = async (ctx, next) => {
  await next();
};

const addUserValidator:Middleware = async (ctx,next)=>{
  const scheme = joi.object({
    name:joi.string().required(),
    year:joi.number().required()
  })
  try {
    await scheme.validateAsync(ctx.query)    
    await next()
  } catch (error) {
    const err = error as ValidationError
    ctx.body = {error:err.details[0]?.message}
  }
} 

const addUser: Middleware = async (ctx, next) => {
  ctx.body = { code: 1, data: 'added' };
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

