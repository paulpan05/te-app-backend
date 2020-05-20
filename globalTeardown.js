const DynamoDbLocal = require('dynamodb-local');

module.exports = async () => {
  DynamoDbLocal.stopChild(process.child);
};
