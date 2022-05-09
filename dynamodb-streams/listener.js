const AWS = require('aws-sdk');

const sns = new AWS.SNS();
const topicArn = process.env.SNS_TOPIC_ARN;

async function processChanges(event) {
    const records = event.Records.map(record => ({
        username: record.dynamodb.NewImage.username.S,
        createdAt: new Date(+record.dynamodb.NewImage.timestamp.S).toString(),
    }));

    const subject = `${records.length} new user(s) has/have been created`;

    const params = {
        Subject: subject,
        Message: `Details: \n\n ${JSON.stringify(records, null, 2)}`,
        TopicArn: topicArn
    };

    await sns.publish(params).promise();
    console.log(`Event has been successfully published to SNS topic ${topicArn}`);
}

module.exports = {
    handler: processChanges
};
