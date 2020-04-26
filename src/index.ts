import * as express from 'express';
import api from './api';
import httpErrorHandler from './error/handlers';

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'cse110.thepaulpan.com');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  return next();
});

app.use('/api/', api);
app.use(httpErrorHandler);

export default app;
