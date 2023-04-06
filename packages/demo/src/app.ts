import Koa from 'koa';
import initRouter from './router';
import { bodyParseJSON, catchError } from 'koa-lite-middewares';

const app = new Koa();

app.use(catchError());

app.use(bodyParseJSON());

app.use(initRouter());

app.listen(3000, () => {
  console.log('Server running at http://127.0.0.1:3000/');
});
