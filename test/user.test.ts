import Users from '../src/db/user';

const dynamodb = (process as any).dynamodb as AWS.DynamoDB.DocumentClient;

it('DynamoDB test', async () => {
  await new Users(dynamodb).createProfile(
    'asdfsaf',
    'Paul Pan',
    'panjunhong05@gmail.com',
    '+1 (626) 691-8088',
    'Los Angeles, CA',
    'hello.jpg',
  );
  const result = await new Users(dynamodb).getProfile('asdfsaf');
  expect(result!.name).toBe('Paul Pan');
  return true;
});
