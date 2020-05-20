import * as AWS from 'aws-sdk';
import * as DynamoDbLocal from 'dynamodb-local';
import * as fs from 'fs';
import * as YAML from 'yaml';
import Users from '../src/db/user';

const isTest = process.env.JEST_WORKER_ID;
const config = {
  ...(isTest && {
    accessKeyId: 'xxxx',
    secretAccessKey: 'xxxx',
    endpoint: 'localhost:8000',
    sslEnabled: false,
    region: 'local-env',
  }),
};

let child;
let dynamodb;

const customTimeout = 30000;

async function asyncForEach(array: [any], callback: Function) {
  for (let index = 0; index < array.length; index += 1) {
    // eslint-disable-next-line no-await-in-loop
    await callback(array[index], index, array);
  }
}

// optional config customization - default is your OS' temp directory and an Amazon server from US West
DynamoDbLocal.configureInstaller({
  installPath: './.dynamodb',
});

beforeAll(async () => {
  const dynamoLocalPort = 8000;

  child = await DynamoDbLocal.launch(dynamoLocalPort, null, [], false, true); // must be wrapped in async function
  const fullDynamo = new AWS.DynamoDB(config);
  dynamodb = new AWS.DynamoDB.DocumentClient(config);
  const file = fs.readFileSync('./serverless.yml', 'utf-8');

  const resources = Object.values(YAML.parse(file).resources.Resources) as any;
  await asyncForEach(resources, async (value) => {
    const { Properties } = value;
    await fullDynamo.createTable(Properties).promise();
  });
}, customTimeout);

it(
  'DynamoDB test',
  async () => {
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
  },
  customTimeout,
);

afterAll(async () => {
  await DynamoDbLocal.stopChild(child);
}, customTimeout);
