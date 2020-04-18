import * as awsServerlessExpress from 'aws-serverless-express';
import app from './app';

export const handler = (event, context) => {
  awsServerlessExpress.proxy(
    awsServerlessExpress.createServer(app), event, context);
};