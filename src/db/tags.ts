import { DynamoDB } from 'aws-sdk';

class Tags {
  docClient: DynamoDB.DocumentClient;

  constructor(docClient: DynamoDB.DocumentClient) {
    this.docClient = docClient;
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
    const params = {
      TableName: 'TETagsTable',
      Key: {
        tag,
      },
    };
    return (await this.docClient.get(params).promise()).Item!.listings as string[];
  }

  async addListing(tag: string, listing: string[]) {
    const params = {
      TableName: 'TETagsTable',
      Key: {
        tag,
      },
      UpdateExpression: 'SET listings = list_append(listings, :value)',
      ExpressionAttributeValues: {
        ':value': [listing],
      },
    };
    await this.docClient.update(params).promise();
  }

  async removeListing(tag: string, listing: string[]) {
    const listings = await this.getListings(tag);
    for (let i = 0; i < listings.length; i += 1) {
      if (listings[i][0] === listing[0] && listings[i][1] === listing[1]) {
        const params = {
          TableName: 'TETagsTable',
          Key: {
            tag,
          },
          UpdateExpression: `REMOVE listings[${i}]`,
        };
        // eslint-disable-next-line no-await-in-loop
        await this.docClient.update(params).promise();
        return;
      }
    }
  }
}

export default Tags;
