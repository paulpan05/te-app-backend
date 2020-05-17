import { DynamoDB } from 'aws-sdk';

class Reports {
  docClient: DynamoDB.DocumentClient;

  constructor(docClient: DynamoDB.DocumentClient) {
    this.docClient = docClient;
  }
}

export default Reports;
