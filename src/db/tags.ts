import { DynamoDB } from 'aws-sdk';

class Tags {
  docClient: DynamoDB.DocumentClient;

  constructor(docClient: DynamoDB.DocumentClient) {
    this.docClient = docClient;
  }

  async getTags() {
    const params = {
      TableName: 'TETagsTable',
    };
    return (await this.docClient.scan(params).promise()).Items;
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

  async removeTag(tag: string) {
    const params = {
      TableName: 'TETagsTable',
      Key: {
        tag,
      },
    };
    await this.docClient.delete(params).promise();
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
        ':value': [JSON.stringify([listingId, creationTime])],
      },
    };
    await this.docClient.update(params).promise();
  }

  async removeListing(tag: string, listingId: string, creationTime: number) {
    const listings = await this.getListings(tag);
    for (let i = 0; i < listings.length; i += 1) {
      if (JSON.parse(listings[i])[0] === listingId && JSON.parse(listings[i])[1] === creationTime) {
        const params = {
          TableName: 'TETagsTable',
          Key: {
            tag,
          },
          UpdateExpression: `REMOVE listings[${i}]`,
        };
        await this.docClient.update(params).promise();
        return;
      }
    }
  }
}

export default Tags;
