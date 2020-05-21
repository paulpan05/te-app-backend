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
        creationDate: Date.now(),
        sold: false,
        soldTo: null,
        comments: [],
        SavedCount: 0,
      },
    };
    await this.docClient.put(params).promise();
  }

  async getListings() {
    const params = {
      TableName: 'TEListingsTable',
      Limit: 10,
    };
    return (await this.docClient.scan(params).promise()).Items;
  }

  async markAsSold(listingId: string, buyerId: string) {
    const params = {
      TableName: 'TEListingsTable',
      Key: {
        listingId,
      },
      UpdateExpression: 'SET sold = :value, soldTo = :buyer',
      ExpressionAttributeValues: {
        ':value': true,
        ':buyer': buyerId,
      },
    };

    await this.docClient.update(params).promise();
  }
}

export default Listings;
