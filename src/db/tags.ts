import { DynamoDB } from 'aws-sdk';

class Tags {
  docClient: DynamoDB.DocumentClient;

  constructor(docClient: DynamoDB.DocumentClient) {
    this.docClient = docClient;
  }

  async getTag(tag: string) {
    const params = {
      TableName: 'TETagsTable',
      Key: {
        tag,
      },
    };
    return (await this.docClient.get(params).promise()).Item;
  }

  async addTag(tag: string) {
    const params = {
      TableName: 'TETagsTable',
      Item: {
        tag,
        listings: [],
      },
    };
    await this.docClient.put(params).promise();
  }

  async getListings(tag: string) {
    return (await this.getTag(tag))!.listings;
  }

  async addListing(tag: string, listingId: string, creationTime: number) {
    const params = {
      TableName: 'TETagsTable',
      Key: {
        tag,
      },
      UpdateExpression: 'SET listings = list_append(listings, :value)',
      ExpressionAttributeValues: {
        ':value': [[listingId, creationTime]],
      },
    };
    await this.docClient.update(params).promise();
  }

  async removeListing(tag: string, listingId: string, creationTime: number) {
    const listings = await this.getListings(tag);
    for (let i = 0; i < listings.length; i += 1) {
      if (listings[i][0] === listingId && listings[i][1] === creationTime) {
        const params = {
          TableName: 'TETagsTable',
          Key: {
            tag,
          },
          UpdateExpression: `REMOVE listings[:value]`,
          ExpressionAttributeValues: {
            ':value': i,
          },
        };
        await this.docClient.update(params).promise();
        return;
      }
    }
  }
}

export default Tags;
