import { DynamoDB } from 'aws-sdk';

class Users {
  docClient: DynamoDB.DocumentClient;

  constructor(docClient: DynamoDB.DocumentClient) {
    this.docClient = docClient;
  }

  async createProfile(
    userId: number,
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
        boughtListings: [],
        soldListings: [],
        buyerRatings: [],
        sellerRatings: [],
        savedListings: [],
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
}

export default Users;
