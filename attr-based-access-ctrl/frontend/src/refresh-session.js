import { fileURLToPath } from "node:url";

import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";

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

// Retrieves new ID and access tokens using the refresh token and use them to get new temporary AWS credentials.
export async function refreshSession(userType) {
  const sessionUser = usersConfig[userType];

  const client = new CognitoIdentityProviderClient({
    region: awsConfig.region,
  });

  const { refreshToken } = sessionUser.tokens;
  const command = new InitiateAuthCommand({
    AuthFlow: "REFRESH_TOKEN", // or REFRESH_TOKEN_AUTH
    ClientId: awsConfig.userPoolClientId, // user pool app client ID
    AuthParameters: {
      REFRESH_TOKEN: refreshToken, // valid refresh token
    },
  });
  const { AuthenticationResult } = await client.send(command);

  if (!AuthenticationResult) {
    throw new Error(
      "Unable to retrieve new ID and access tokens. Received empty result.",
    );
  }

  const updatedTokens = {
    accessToken: AuthenticationResult.AccessToken,
    idToken: AuthenticationResult.IdToken,
    refreshToken, // will remain the same
  };
  await writeTokens(userType, updatedTokens);

  console.log("getting temporary AWS credentials from Cognito Identity Pool");
  const credentials = await getTempAWSCredentials(updatedTokens);
  await writeTempAWSCredentials(userType, credentials);

  console.log("session successfully reloaded");
}
