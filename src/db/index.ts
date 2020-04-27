import { DynamoDB } from 'aws-sdk';

const docClient = new DynamoDB.DocumentClient();

export default docClient;
