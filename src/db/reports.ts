import { DynamoDB } from 'aws-sdk';

class ReportsTable {
  docClient: DynamoDB.DocumentClient;

  constructor(docClient: DynamoDB.DocumentClient) {
    this.docClient = docClient;
  }
}

export default ReportsTable;
