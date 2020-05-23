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
        searchTitle: title.trim().toLowerCase(),
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

  async getListings(exclusiveStartKey: any, limit: number) {
    const params = {
      TableName: 'TEListingsTable',
      ExclusiveStartKey: exclusiveStartKey,
      Limit: limit,
    };
    const result = await this.docClient.scan(params).promise();
    return { Items: result.Items, LastEvaluatedKey: result.LastEvaluatedKey };
  }

  async searchListings(searchTerm: string) {
    const params = {
      TableName: 'TEListingsTable',
      FilterExpression: 'contains(searchTitle,:value)', // a string representing a constraint on the attribute
      ExpressionAttributeValues: {
        // a map of substitutions for all attribute values
        ':value': { S: searchTerm.trim().toLowerCase() },
      },
    };
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
