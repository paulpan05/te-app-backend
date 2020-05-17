import { DynamoDB } from 'aws-sdk';

class UsersTable {
  docClient: DynamoDB.DocumentClient;

  constructor(docClient: DynamoDB.DocumentClient) {
    this.docClient = docClient;
  }
}

export default UsersTable;
