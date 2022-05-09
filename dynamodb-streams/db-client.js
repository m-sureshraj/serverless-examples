const { DynamoDB } = require('aws-sdk');

module.exports = {
    DBClient: new DynamoDB.DocumentClient({}),
};
