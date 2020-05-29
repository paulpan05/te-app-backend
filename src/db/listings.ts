import { DynamoDB } from 'aws-sdk';

class Listings {
  docClient: DynamoDB.DocumentClient;

  constructor(docClient: DynamoDB.DocumentClient) {
    this.docClient = docClient;
  }

  async createListing(
    listingId: string,
    creationTime: number,
    userId: string,
    title: string,
    price: number,
    description: string,
    location: string,
    tags: string[],
    pictures: string[],
  ) {
    const params = {
      TableName: 'TEListingsTable',
      Item: {
        listingId,
        userId,
        title,
        searchTitle: title.trim().toLowerCase(),
        price,
        description,
        location,
        tags,
        pictures,
        creationTime,
        sold: false,
        soldTo: null,
        comments: [],
        savedCount: 0,
      },
    };
    await this.docClient.put(params).promise();
  }

  async getListings(exclusiveStartKey?: any, limit?: number) {
    const params = {
      TableName: 'TEListingsTable',
      ExclusiveStartKey: exclusiveStartKey,
      Limit: limit,
    };
    const result = await this.docClient.scan(params).promise();
    return { Items: result.Items, LastEvaluatedKey: result.LastEvaluatedKey };
  }

  async getListingsByIds(listings: (string | number)[][]) {
    const params = {
      RequestItems: {
        TEListingsTable: {
          Keys: listings.map((value) => {
            return {
              listingId: value[0],
              creationTime: value[1],
            };
          }),
        },
      },
    };
    return (await this.docClient.batchGet(params).promise()).Responses!.TEListingsTable;
  }

  async getListing(listingId: string, creationTime: number) {
    const params = {
      TableName: 'TEListingsTable',
      Key: {
        listingId,
        creationTime,
      },
    };
    return (await this.docClient.get(params).promise()).Item;
  }

  async searchListings(searchTerm: string) {
    const params = {
      TableName: 'TEListingsTable',
      FilterExpression: 'contains(searchTitle,:value)', // a string representing a constraint on the attribute
      ExpressionAttributeValues: {
        // a map of substitutions for all attribute values
        ':value': searchTerm.trim().toLowerCase(),
      },
    };
    return (await this.docClient.scan(params).promise()).Items;
  }

  async markAsSold(listingId: string, creationTime: number, buyerId: string) {
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

  async incrementSavedCount(listingId: string, creationTime: number) {
    const params = {
      TableName: 'TEListingsTable',
      Key: {
        listingId,
        creationTime,
      },
      UpdateExpression: 'ADD savedCount :value',
      ExpressionAttributeValues: {
        ':value': 1,
      },
    };
    await this.docClient.update(params).promise();
  }

  async decrementSavedCount(listingId: string, creationTime: number) {
    const params = {
      TableName: 'TEListingsTable',
      Key: {
        listingId,
        creationTime,
      },
      UpdateExpression: 'ADD savedCount :value',
      ExpressionAttributeValues: {
        ':value': -1,
      },
    };
    await this.docClient.update(params).promise();
  }

  async addTag(listingId: string, creationTime: number, tag: string) {
    const params = {
      TableName: 'TEListingsTable',
      Key: {
        listingId,
        creationTime,
      },
      UpdateExpression: 'SET tags = list_append(tags, :value)',
      ExpressionAttributeValues: {
        ':value': [tag],
      },
    };
    await this.docClient.update(params).promise();
  }

  async deleteTag(listingId: string, creationTime: number, tag: string) {
    const { tags } = (await this.getListing(listingId, creationTime))!;
    for (let i = 0; i < tags.length; i += 1) {
      if (tags[i] === tag) {
        const params = {
          TableName: 'TEListingsTable',
          Key: {
            listingId,
            creationTime,
          },
          UpdateExpression: `REMOVE tags[:value]`,
          ExpressionAttributeValues: {
            ':value': i,
          },
        };
        await this.docClient.update(params).promise();
        return;
      }
    }
  }

  async addPicture(listingId: string, creationTime: number, picture: string) {
    const params = {
      TableName: 'TEListingsTable',
      Key: {
        listingId,
        creationTime,
      },
      UpdateExpression: 'SET pictures = list_append(pictures, :value)',
      ExpressionAttributeValues: {
        ':value': [picture],
      },
    };
    await this.docClient.update(params).promise();
  }

  async deletePicture(listingId: string, creationTime: number, picture: string) {
    const { pictures } = (await this.getListing(listingId, creationTime))!;
    for (let i = 0; i < pictures.length; i += 1) {
      if (pictures[i] === picture) {
        const params = {
          TableName: 'TEListingsTable',
          Key: {
            listingId,
            creationTime,
          },
          UpdateExpression: `REMOVE pictures[:value]`,
          ExpressionAttributeValues: {
            ':value': i,
          },
        };
        await this.docClient.update(params).promise();
        return;
      }
    }
  }

  async updatePrice(listingId: string, creationTime: number, price: number) {
    const params = {
      TableName: 'TEListingsTable',
      Key: {
        listingId,
        creationTime,
      },
      UpdateExpression: 'SET price = :value',
      ExpressionAttributeValues: {
        ':value': price,
      },
    };
    await this.docClient.update(params).promise();
  }

  async updateLocation(listingId: string, creationTime: number, location: string) {
    const params = {
      TableName: 'TEListingsTable',
      Key: {
        listingId,
        creationTime,
      },
      UpdateExpression: 'SET #location = :value',
      // we have to use this because Location is a reserved keyword
      ExpressionAttributeNames: {
        '#location': 'location',
      },
      ExpressionAttributeValues: {
        ':value': location,
      },
    };
    this.docClient.update(params).promise();
  }
}

export default Listings;
