const AWS = require('aws-sdk');
const DynamoDbLocal = require('dynamodb-local');
const fs = require('fs');
const YAML = require('yaml');

module.exports = async () => {
  const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index += 1) {
      await callback(array[index], index, array);
    }
  };
  // optional config customization - default is your OS' temp directory and an Amazon server from US West
  DynamoDbLocal.configureInstaller({
    installPath: './.dynamodb',
  });

  const config = {
    accessKeyId: 'xxxx',
    secretAccessKey: 'xxxx',
    endpoint: 'localhost:8000',
    sslEnabled: false,
    region: 'local-env',
  };

  const dynamoLocalPort = 8000;

  process.child = await DynamoDbLocal.launch(dynamoLocalPort, null, [], false, true); // must be wrapped in async function
  AWS.config.update(config);
  const fullDynamo = new AWS.DynamoDB();
  process.dynamodb = new AWS.DynamoDB.DocumentClient();
  const file = fs.readFileSync('./serverless.yml', 'utf-8');

  const resources = Object.values(YAML.parse(file).resources.Resources);
  await asyncForEach(resources, async (value) => {
    const { Type, Properties } = value;
    if (Type === 'AWS::DynamoDB::Table') {
      await fullDynamo.createTable(Properties).promise();
    }
  });
};
