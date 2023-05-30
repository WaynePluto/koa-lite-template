import Koa from 'koa';
import initRouter from './router';
import { bodyParseJSON, catchError } from 'koa-lite-middlewares';
import { createKoaMiddleware, createContext } from './middlewares/trpc'
import { appRouter } from './trpc-router';

const app = new Koa();

app.use(catchError());

app.use(createKoaMiddleware({ router: appRouter, createContext, prefix: '/trpc' }))

app.use(bodyParseJSON());

app.use(initRouter({ exclude: '/trpc' }));

app.listen(3000, () => {
  console.log('Server running at http://127.0.0.1:3000/');
});
