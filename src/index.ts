import * as express from 'express';
import * as AWS from "aws-sdk";

const docClient = new AWS.DynamoDB.DocumentClient();

const app = express();

app.get('/', (req, res) => {
  res.send('Hello everyone!');
});

export default app;