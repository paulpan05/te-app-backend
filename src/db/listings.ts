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
}

export default Listings;
