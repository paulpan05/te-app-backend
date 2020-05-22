import { DynamoDB } from 'aws-sdk';

class Reports {
  docClient: DynamoDB.DocumentClient;

  constructor(docClient: DynamoDB.DocumentClient) {
    this.docClient = docClient;
  }

  async addReport(
    type: string,
    reportId: string,
    description: string,
    userId: string,
    reportedUserId?: string,
    listingId?: string,
    commentId?: string,
  ) {
    const params = {
      TableName: 'TEReportsTable',
      Item: {
        type,
        reportId,
        description,
        userId,
        reportedUserId,
        listingId,
        commentId,
      },
    };
    await this.docClient.put(params).promise();
  }
}

export default Reports;
