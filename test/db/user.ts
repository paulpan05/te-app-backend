import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import Users from '../../src/db/user';

const dynamodb = (process as any).dynamodb as AWS.DynamoDB.DocumentClient;

export default () =>
  describe('Test the TEUsersTable', () => {
    it('User insertion test', async () => {
      try {
        await new Users(dynamodb).createProfile(
          'asdfsaf',
          'Paul Pan',
          'panjunhong05@gmail.com',
          '+1 (626) 691-8088',
          'Los Angeles, CA',
          'hello.jpg',
        );
      } catch (err) {
        expect(err).toBe(undefined);
      }
    });

    it('Get user test', async () => {
      let result: DocumentClient.AttributeMap | undefined;
      try {
        result = await new Users(dynamodb).getProfile('asdfsaf');
      } catch (err) {
        expect(err).toBe(undefined);
      }
      expect(result!.name).toBe('Paul Pan');
    });
  });
