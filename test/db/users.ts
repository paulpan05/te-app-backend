import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { UsersTable } from '../../src/db';

export default () =>
  describe('Test the TEUsersTable', () => {
    it('User insertion test', async () => {
      try {
        await UsersTable.createProfile(
          'asdfsaf',
          'Paul Pan',
          'panjunhong05@gmail.com',
          'hello.jpg',
          '+1 (626) 691-8088',
        );
      } catch (err) {
        expect(err).toBe(undefined);
      }
    });

    it('Get user test', async () => {
      let result: DocumentClient.AttributeMap | undefined;
      try {
        result = await UsersTable.getProfile('asdfsaf');
      } catch (err) {
        expect(err).toBe(undefined);
      }
      expect(result!.name).toBe('Paul Pan');
    });
  });
