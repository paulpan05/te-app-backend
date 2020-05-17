import { DynamoDB } from 'aws-sdk';
import Users from './users';
import Listings from './listings';
import Reports from './reports';

const docClient = new DynamoDB.DocumentClient();

const UsersTable = new Users(docClient);
const ListingsTable = new Listings(docClient);
const ReportsTable = new Reports(docClient);

export { UsersTable, ListingsTable, ReportsTable };
