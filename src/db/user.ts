import { DynamoDB } from 'aws-sdk';

class Users {
  docClient: DynamoDB.DocumentClient;

  constructor(docClient: DynamoDB.DocumentClient) {
    this.docClient = docClient;
  }

  async createProfile(
    userId: string,
    name: string,
    email: string,
    phone: string,
    location: string,
    picture: string,
  ) {
    const params = {
      TableName: 'TEUsersTable',
      Item: {
        // a map of attribute name to AttributeValue
        userId,
        name,
        email,
        phone,
        location,
        picture,
        activeListings: [],
        boughtListings: [],
        soldListings: [],
        savedListings: [],
        ratings: [],
      },
    };
    await this.docClient.put(params).promise();
  }

  async getProfile(userId: string) {
    const params = {
      TableName: 'TEUsersTable',
      Key: {
        userId,
      },
    };
    return (await this.docClient.get(params).promise()).Item;
  }

  async updatePhone(userId: string, newPhone: string) {
    const params = {
      TableName: 'TEUsersTable',
      Key: {
        userId,
      },
      UpdateExpression: 'SET phone = :value',
      ExpressionAttributeValues: {
        ':value': newPhone,
      },
    };
    await this.docClient.update(params).promise();
  }

  async updateLocation(userId: string, newLocation: string) {
    const params = {
      TableName: 'TEUsersTable',
      Key: {
        userId,
      },
      UpdateExpression: 'SET #location = :value',
      // we have to use this because Location is a reserved keyword
      ExpressionAttributeNames: {
        '#location': 'location',
      },
      ExpressionAttributeValues: {
        ':value': newLocation,
      },
    };
    await this.docClient.update(params).promise();
  }

  async removeActiveListing(userId: string, listingId: string) {
    const activeListings = (await this.getProfile(userId))!.activeListings as [string];
    activeListings.map(async (value, index) => {
      if (value === listingId) {
        const params = {
          TableName: 'TEUsersTable',
          Key: {
            userId,
          },
          UpdateExpression: `REMOVE activeListings[${index}]`,
        };
        await this.docClient.update(params).promise();
      }
    });
  }

  async addSoldListing(userId: string, listingId: string) {
    const params = {
      TableName: 'TEUsersTable',
      Key: {
        userId,
      },
      UpdateExpression: 'SET soldListings = list_append(soldListings, :value)',
      ExpressionAttributeValues: {
        ':value': listingId,
      },
    };
    await this.docClient.update(params).promise();
  }

  async addSavedListing(userId: string, listingId: string) {
    const params = {
      TableName: 'TEUsersTable',
      Key: {
        userId,
      },
      UpdateExpression: 'SET savedListings = list_append(savedListings, :value)',
      ExpressionAttributeValues: {
        ':value': listingId,
      },
    };
    await this.docClient.update(params).promise();
  }
}

export default Users;
