import { promisify } from "node:util";

import AWS from "aws-sdk";

import awsConfig from "../config/aws.json" assert { type: "json" };

export async function getTempAWSCredentials(tokens) {
  const key = `cognito-idp.${awsConfig.region}.amazonaws.com/${awsConfig.userPoolId}`;
  const logins = {
    [key]: tokens.idToken,
  };

  AWS.config.region = awsConfig.region;
  const AWSCredentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: awsConfig.identityPoolId,
    Logins: logins,
  });

  const get = promisify(AWSCredentials.get).bind(AWSCredentials);
  await get();

  return {
    accessKeyId: AWSCredentials.accessKeyId,
    secretAccessKey: AWSCredentials.secretAccessKey,
    sessionToken: AWSCredentials.sessionToken,
  };
}
