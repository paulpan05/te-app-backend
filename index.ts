import { APIGatewayProxyEvent, Context } from "aws-lambda";
import * as awsServerlessExpress from 'aws-serverless-express';
import app from './src';

const server = awsServerlessExpress.createServer(app);
const handler = (event: APIGatewayProxyEvent, context: Context) => {
  awsServerlessExpress.proxy(server, event, context);
};

export { handler as default };
