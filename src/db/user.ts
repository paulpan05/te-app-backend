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

  async updateName(userId: string, name: string) {
    const params = {
      TableName: 'TEUsersTable',
      Key: {
        userId,
      },
      UpdateExpression: 'SET name = :value',
      ExpressionAttributeValues: {
        ':value': name,
      },
    };
    await this.docClient.update(params).promise();
  }

  async updatePhone(userId: string, phone: string) {
    const params = {
      TableName: 'TEUsersTable',
      Key: {
        userId,
      },
      UpdateExpression: 'SET phone = :value',
      ExpressionAttributeValues: {
        ':value': phone,
      },
    };
    await this.docClient.update(params).promise();
  }

  async updateEmail(userId: string, email: string) {
    const params = {
      TableName: 'TEUsersTable',
      Key: {
        userId,
      },
      UpdateExpression: 'SET email = :value',
      ExpressionAttributeValues: {
        ':value': email,
      },
    };
    await this.docClient.update(params).promise();
  }

  async updatePicture(userId: string, picture: string) {
    const params = {
      TableName: 'TEUsersTable',
      Key: {
        userId,
      },
      UpdateExpression: 'SET picture = :value',
      ExpressionAttributeValues: {
        ':value': picture,
      },
    };
    await this.docClient.update(params).promise();
  }

  async updateLocation(userId: string, location: string) {
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
        ':value': location,
      },
    };
    await this.docClient.update(params).promise();
  }

  async removeActiveListing(userId: string, listingId: string, creationTime: string) {
    const activeListings = (await this.getProfile(userId))!.activeListings as [string];
    for (let i = 0; i < activeListings.length; i += 1) {
      if (activeListings[i][0] === listingId && activeListings[i][1] === creationTime) {
        const params = {
          TableName: 'TEUsersTable',
          Key: {
            userId,
          },
          UpdateExpression: `REMOVE activeListings[${i}]`,
        };
        // eslint-disable-next-line no-await-in-loop
        await this.docClient.update(params).promise();
        return;
      }
    }
  }

  async removeSavedListing(userId: string, listingId: string, creationTime: string) {
    const savedListings = (await this.getProfile(userId))!.savedListings as [string];
    for (let i = 0; i < savedListings.length; i += 1) {
      if (savedListings[i][0] === listingId && savedListings[i][1] === creationTime) {
        const params = {
          TableName: 'TEUsersTable',
          Key: {
            userId,
          },
          UpdateExpression: `REMOVE savedListings[${i}]`,
        };
        // eslint-disable-next-line no-await-in-loop
        await this.docClient.update(params).promise();
        return;
      }
    }
  }

  async addSoldListing(userId: string, listingId: string, creationTime: string) {
    const params = {
      TableName: 'TEUsersTable',
      Key: {
        userId,
      },
      UpdateExpression: 'SET soldListings = list_append(soldListings, :value)',
      ExpressionAttributeValues: {
        ':value': [[listingId, creationTime]],
      },
    };
    await this.docClient.update(params).promise();
  }

  async addSavedListing(userId: string, listingId: string, creationTime: string) {
    const params = {
      TableName: 'TEUsersTable',
      Key: {
        userId,
      },
      UpdateExpression: 'SET savedListings = list_append(savedListings, :value)',
      ExpressionAttributeValues: {
        ':value': [[listingId, creationTime]],
      },
    };
    await this.docClient.update(params).promise();
  }

  async addBoughtListing(userId: string, listingId: string, creationTime: string) {
    const params = {
      TableName: 'TEUsersTable',
      Key: {
        userId,
      },
      UpdateExpression: 'SET boughtListings = list_append(boughtListings, :value)',
      ExpressionAttributeValues: {
        ':value': [[listingId, creationTime]],
      },
    };
    await this.docClient.update(params).promise();
  }

  async addRating(userId: string, rating: number) {
    const params = {
      TableName: 'TEUsersTable',
      Key: {
        userId,
      },
      UpdateExpression: 'SET ratings = list_append(ratings, :value)',
      ExpressionAttributeValues: {
        ':value': [rating],
      },
    };
    await this.docClient.update(params).promise();
  }
}

export default Users;
