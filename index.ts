import awsServerlessExpress = require('aws-serverless-express');
import app from './app';
const server = awsServerlessExpress.createServer(app);

module.exports.handler = (event, context) => { awsServerlessExpress.proxy(server, event, context) }
