import { promisify } from "node:util";
import { fileURLToPath } from 'node:url';

import AWS from "aws-sdk";

import {
  writeTokens,
  parseCommandLineArgs,
  writeTempAWSCredentials,
} from "./util.js";
import { getTempAWSCredentials } from "./get-temp-aws-credentials.js";
import awsConfig from "../config/aws.json" assert { type: "json" };
import usersConfig from "../config/users.json" assert { type: "json" };

// if this module is called directly from the command line. i.e. `npm run refresh-session` or `node refresh-session.js`
// equivalent to `require.main === module` in commonjs
const self = fileURLToPath(import.meta.url);
if (process.argv[1] === self) {
  const { userType } = parseCommandLineArgs();
  await refreshSession(userType);
}

// Retrieves new ID and access tokens using refresh token and use them to get new temporary AWS credentials.
export async function refreshSession(userType) {
  const sessionUser = usersConfig[userType];

  AWS.config.region = awsConfig.region;
  const cognitoIdentityServiceProvider =
    new AWS.CognitoIdentityServiceProvider();

  const { refreshToken } = sessionUser.tokens;
  const params = {
    AuthFlow: "REFRESH_TOKEN",
    ClientId: awsConfig.userPoolClientId,
    AuthParameters: {
      REFRESH_TOKEN: refreshToken,
    },
  };

  const initiateAuth = promisify(
    cognitoIdentityServiceProvider.initiateAuth,
  ).bind(cognitoIdentityServiceProvider);
  const result = await initiateAuth(params);

  const { AccessToken, IdToken } = result.AuthenticationResult;
  const updatedTokens = {
    accessToken: AccessToken,
    idToken: IdToken,
    refreshToken, // will remain the same
  };
  await writeTokens(userType, updatedTokens);

  console.log("getting temporary AWS credentials from Cognito Identity Pool");
  const credentials = await getTempAWSCredentials(updatedTokens);
  await writeTempAWSCredentials(userType, credentials);

  console.log("session successfully reloaded");
}
