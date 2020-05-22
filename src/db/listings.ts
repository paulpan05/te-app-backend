import { DynamoDB } from 'aws-sdk';

class Listings {
  docClient: DynamoDB.DocumentClient;

  constructor(docClient: DynamoDB.DocumentClient) {
    this.docClient = docClient;
  }

  async createListing(
    listingId: string,
    userId: string,
    title: string,
    price: number,
    description: string,
    location: string,
    tags: [string],
    pictures: [string],
  ) {
    const params = {
      TableName: 'TEListingsTable',
      Item: {
        listingId,
        userId,
        title,
        price,
        description,
        location,
        tags,
        pictures,
        creationTime: Date.now(),
        sold: false,
        soldTo: null,
        comments: [],
        savedCount: 0,
      },
    };
    await this.docClient.put(params).promise();
  }

  async getListings(exclusiveStartKey: any) {
    const params: any = {
      TableName: 'TEListingsTable',
      Limit: 10,
    };
    if (exclusiveStartKey) {
      params.ExclusiveStartKey = exclusiveStartKey;
    }
    return (await this.docClient.scan(params).promise()).Items;
  }

  async markAsSold(listingId: string, creationTime: string, buyerId: string) {
    const params = {
      TableName: 'TEListingsTable',
      Key: {
        listingId,
        creationTime,
      },
      UpdateExpression: 'SET sold = :value, soldTo = :buyer',
      ExpressionAttributeValues: {
        ':value': true,
        ':buyer': buyerId,
      },
    };
    await this.docClient.update(params).promise();
  }

  async incrementSavedCount(listingId: string, creationTime: string) {
    const params = {
      TableName: 'TEListingsTable',
      Key: {
        listingId,
        creationTime,
      },
      UpdateExpression: 'ADD savedCount 1',
    };
    await this.docClient.update(params).promise();
  }
}

export default Listings;
