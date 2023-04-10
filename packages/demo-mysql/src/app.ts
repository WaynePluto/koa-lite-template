import Koa from 'koa';
import { config } from './config';
import initKnex from './middlewares/knex';
import initRouter from './router';
import { bodyParseJSON, catchError } from 'koa-lite-middlewares';

const app = new Koa();

app.use(catchError());

app.use(bodyParseJSON());

app.use(initKnex(config.development));

app.use(initRouter());

app.listen(3000, () => {
  console.log('Server running at http://127.0.0.1:3000/');
});
