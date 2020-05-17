import { DynamoDB } from 'aws-sdk';

class Listings {
  docClient: DynamoDB.DocumentClient;

  constructor(docClient: DynamoDB.DocumentClient) {
    this.docClient = docClient;
  }
}

export default Listings;
