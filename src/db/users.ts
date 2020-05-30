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
    picture: string,
    phone?: string,
  ) {
    const params = {
      TableName: 'TEUsersTable',
      Item: {
        // a map of attribute name to AttributeValue
        userId,
        name,
        email,
        phone,
        picture,
        activeListings: [],
        boughtListings: [],
        soldListings: [],
        savedListings: [],
        ratings: [],
        listingsToRate: [],
      },
    };
    await this.docClient.put(params).promise();
  }

  async searchProfiles(name: string) {
    const params = {
      TableName: 'TEUsersTable',
      FilterExpression: 'contains(#name,:value)',
      ExpressionAttributeNames: {
        '#name': 'name',
      },
      ExpressionAttributeValues: {
        ':value': name.trim().toLowerCase(),
      },
    };
    return (await this.docClient.scan(params).promise()).Items;
  }

  async addListingToRate(
    userId: string,
    listingId: string,
    creationTime: number,
    sellerId: string,
  ) {
    const params = {
      TableName: 'TEUsersTable',
      Key: {
        userId,
      },
      UpdateExpression: 'SET listingsToRate = list_append(listingsToRate, :value)',
      ExpressionAttributeValues: {
        ':value': [[listingId, creationTime, sellerId]],
      },
    };
    await this.docClient.scan(params).promise();
  }

  async removeListingToRate(userId: string, listingId: string, creationTime: number) {
    const listingsToRate = (await this.getProfile(userId))!.listingsToRate as (string | number)[];
    for (let i = 0; i < listingsToRate.length; i += 1) {
      if (listingsToRate[i][0] === listingId && listingsToRate[i][1] === creationTime) {
        const params = {
          TableName: 'TEUsersTable',
          Key: {
            userId,
          },
          UpdateExpression: `REMOVE listingsToRate[${i}]`,
        };
        await this.docClient.update(params).promise();
        return;
      }
    }
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
      UpdateExpression: 'SET #name = :value',
      // we have to use this because Location is a reserved keyword
      ExpressionAttributeNames: {
        '#name': 'name',
      },
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

  async removeActiveListing(userId: string, listingId: string, creationTime: number) {
    const activeListings = (await this.getProfile(userId))!.activeListings as (string | number)[];
    for (let i = 0; i < activeListings.length; i += 1) {
      if (activeListings[i][0] === listingId && activeListings[i][1] === creationTime) {
        const params = {
          TableName: 'TEUsersTable',
          Key: {
            userId,
          },
          UpdateExpression: `REMOVE activeListings[${i}]`,
        };
        await this.docClient.update(params).promise();
        return;
      }
    }
  }

  async removeSavedListing(userId: string, listingId: string, creationTime: number) {
    const savedListings = (await this.getProfile(userId))!.savedListings as (string | number)[];
    for (let i = 0; i < savedListings.length; i += 1) {
      if (savedListings[i][0] === listingId && savedListings[i][1] === creationTime) {
        const params = {
          TableName: 'TEUsersTable',
          Key: {
            userId,
          },
          UpdateExpression: `REMOVE savedListings[${i}]`,
        };
        await this.docClient.update(params).promise();
        return;
      }
    }
  }

  async addSoldListing(userId: string, listingId: string, creationTime: number) {
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

  async addSavedListing(userId: string, listingId: string, creationTime: number) {
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

  async addBoughtListing(userId: string, listingId: string, creationTime: number) {
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

  async addActiveListing(userId: string, listingId: string, creationTime: number) {
    const params = {
      TableName: 'TEUsersTable',
      Key: {
        userId,
      },
      UpdateExpression: 'SET activeListings = list_append(activeListings, :value)',
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
