import * as express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello everyone!');
});

export default app;