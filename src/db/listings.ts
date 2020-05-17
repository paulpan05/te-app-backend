import { DynamoDB } from 'aws-sdk';

class ListingsTable {
  docClient: DynamoDB.DocumentClient;

  constructor(docClient: DynamoDB.DocumentClient) {
    this.docClient = docClient;
  }
}

export default ListingsTable;
