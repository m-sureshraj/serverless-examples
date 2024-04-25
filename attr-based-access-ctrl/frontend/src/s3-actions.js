import { S3Client, ListObjectsCommand } from "@aws-sdk/client-s3";

import awsConfig from "../config/aws.json" assert { type: "json" };
import { getSessionUser, parseCommandLineArgs } from "./util.js";

const { userType, bucketName } = parseCommandLineArgs();
const { awsTempCredentials } = getSessionUser(userType);

const bucketNameMapping = {
  free: awsConfig.freeContentBucketName,
  premium: awsConfig.premiumContentBucketName,
};

const client = new S3Client({
  region: awsConfig.region,
  credentials: {
    accessKeyId: awsTempCredentials.accessKeyId,
    secretAccessKey: awsTempCredentials.secretAccessKey,
    sessionToken: awsTempCredentials.sessionToken,
  },
});

const command = new ListObjectsCommand({
  Bucket: bucketName ?? bucketNameMapping[userType],
  MaxKeys: 2,
});
const response = await client.send(command);
console.log(response);
