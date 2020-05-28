import * as express from 'express';
import * as bodyParser from 'body-parser';
import api from './api';
import { httpErrorHandler, notFoundHandler } from './error/handlers';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*' /* 'https://triton-exchange.netlify.app' */);
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  return next();
});

app.use('/', api);
app.use(httpErrorHandler);
app.use(notFoundHandler);

export default app;
