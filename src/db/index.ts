import { DynamoDB } from 'aws-sdk';
import User from './user';
import Listings from './listings';
import Reports from './reports';
import config from '../config';

const docClient = config.isTest
  ? ((process as any).dynamodb as DynamoDB.DocumentClient)
  : new DynamoDB.DocumentClient();

const UsersTable = new User(docClient);
const ListingsTable = new Listings(docClient);
const ReportsTable = new Reports(docClient);

export { UsersTable, ListingsTable, ReportsTable };
