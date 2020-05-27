import * as express from 'express';
import api from './api';
import { httpErrorHandler, notFoundHandler } from './error/handlers';

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://triton-exchange.netlify.app');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  return next();
});

app.use('/', api);
app.use(httpErrorHandler);
app.use(notFoundHandler);

export default app;
