import { DynamoDB } from 'aws-sdk';
import Users from './users';
import Listings from './listings';
import Reports from './reports';
import config from '../config';
import Tags from './tags';

const docClient = config.isTest
  ? ((process as any).dynamodb as DynamoDB.DocumentClient)
  : new DynamoDB.DocumentClient();

const UsersTable = new Users(docClient);
const ListingsTable = new Listings(docClient);
const ReportsTable = new Reports(docClient);
const TagsTable = new Tags(docClient);

export { UsersTable, ListingsTable, ReportsTable, TagsTable };
