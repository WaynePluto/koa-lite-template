import Koa from 'koa';
import bodyParseJSON from './middlewares/body-parse-json';
import catchError from './middlewares/catch-error';
import { initRouter } from './router';

const app = new Koa();

app.use(catchError());

app.use(bodyParseJSON());

app.use(initRouter());

app.listen(3000, () => {
  console.log('Server running at http://127.0.0.1:3000/');
});
