import { S3Client, ListObjectsCommand } from "@aws-sdk/client-s3";

import awsConfig from "../config/aws.json" assert { type: "json" };
import { getSessionUser, parseCommandLineArgs } from "./util.js";

const { freeContentBucketName, premiumContentBucketName } = awsConfig;

const { userType, bucketName } = parseCommandLineArgs();
if (bucketName !== undefined) {
  const availableBuckets = [freeContentBucketName, premiumContentBucketName];
  if (!availableBuckets.includes(bucketName)) {
    throw new Error(
      `Invalid bucket name: "${bucketName}". Must be one of: ${availableBuckets.join(
        ", ",
      )}`,
    );
  }
}

const { awsTempCredentials } = getSessionUser(userType);
const client = new S3Client({
  region: awsConfig.region,
  credentials: {
    accessKeyId: awsTempCredentials.accessKeyId,
    secretAccessKey: awsTempCredentials.secretAccessKey,
    sessionToken: awsTempCredentials.sessionToken,
  },
});

const bucketNameMapping = {
  free: awsConfig.freeContentBucketName,
  premium: awsConfig.premiumContentBucketName,
};
const Bucket = bucketName ?? bucketNameMapping[userType];
console.log(`${userType} user accessing bucket: ${Bucket}\n`);

const command = new ListObjectsCommand({
  Bucket,
  MaxKeys: 2,
});
const response = await client.send(command);
console.log(response);
