import * as awsServerlessExpress from 'aws-serverless-express';
import app from './app';

const server = awsServerlessExpress.createServer(app);
const handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};

export { handler as default };
