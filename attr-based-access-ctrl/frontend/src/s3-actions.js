import { S3Client, ListObjectsCommand } from "@aws-sdk/client-s3";

import awsConfig from '../config/aws.json' assert { type: "json" };
import { getSessionUser } from './util.js'

const { awsTempCredentials } = getSessionUser('premiumUser');

const client = new S3Client({
  region: awsConfig.region,
  credentials: {
    accessKeyId: awsTempCredentials.accessKeyId,
    secretAccessKey: awsTempCredentials.secretAccessKey,
    sessionToken: awsTempCredentials.sessionToken
  },
});

const command = new ListObjectsCommand({
  Bucket: awsConfig.premiumContentBucketName,
  MaxKeys: 2
});
const response = await client.send(command);
console.log(response);
