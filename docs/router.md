# 自定义轻量路由库

## 使用方法

### 1. 构造全局路由对象

```ts
// router.ts
import Router from "./libs/router";
export const router = new Router();
```

### 2. 定义路由组

```ts
// user/controller.ts
import { router } from '../../router';
const prefix = 'user';
// 定义路由中间件，第一个参数指定路由比如 /,/info等，第二个参数指定路由方法
router.use(prefix, '*', middlewares);
// 定义路由组
const route = router.createRoute(prefix);
```

### 3. 配置控制器

```ts
// 在路由分组上配置处理中间件，不支持动态路由
route.get('/', getUsers);
route.post('/', validator(AddUserQuery), addUser)
route.get('/info', getUserInfo);
```