const { DBClient } = require('./db-client')

const tableName = process.env.TABLE_NAME;

async function insertItem(event) {
    const { username } = JSON.parse(event.body);

    const item = {
        username,
        timestamp: Date.now().toString(),
    };

    const params = {
        TableName: tableName,
        Item: item
    };

    await DBClient.put(params).promise();
    console.log('Item successfully added to the db', { item });
}

module.exports = {
    handler: insertItem,
};
