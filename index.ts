import awsServerlessExpress = require('aws-serverless-express');
import AWS = require('aws-sdk');
import app from './app';

const server = awsServerlessExpress.createServer(app);



export const handler = (event, context) => { awsServerlessExpress.proxy(server, event, context) }
