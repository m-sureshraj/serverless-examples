import { promisify } from "node:util";

// https://www.maxivanov.io/aws-cognito-amplify-vs-amazon-cognito-identity-js-vs-aws-sdk/
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";

import {
  writeTokens,
  getUserPoolConfig,
  parseCommandLineArgs,
  writeTempAWSCredentials,
} from "./util.js";
import { getTempAWSCredentials } from "./get-temp-aws-credentials.js";
import usersConfig from "../config/users.json" assert { type: "json" };

const { userType } = parseCommandLineArgs();
const sessionUser = usersConfig[userType];

await signIn();

// Logs the user into the application
// The UserPool client is configured to support only Secure Remote Password (SRP) authentication flow for enhanced security
//  and the `amazon-cognito-identity-js` lib handles this part internally
async function signIn() {
  const userPoolConfig = getUserPoolConfig();
  const userPool = new CognitoUserPool(userPoolConfig);

  const userData = {
    Username: sessionUser.username,
    Pool: userPool,
  };
  const cognitoUser = new CognitoUser(userData);

  const authenticationData = {
    Username: sessionUser.username,
    Password: sessionUser.password,
  };
  const authenticationDetails = new AuthenticationDetails(authenticationData);

  const authenticateUser = promisify(cognitoUser.authenticateUser).bind(
    cognitoUser,
  );
  await authenticateUser(authenticationDetails, {
    onSuccess: async (result) => {
      console.log("successfully signed in");
      const tokens = {
        accessToken: result.getAccessToken().getJwtToken(),
        idToken: result.getIdToken().getJwtToken(),
        refreshToken: result.getRefreshToken().getToken(),
      };
      await writeTokens(userType, tokens);

      console.log("getting temporary AWS credentials from Cognito Identity Pool");
      const credentials = await getTempAWSCredentials(tokens);
      await writeTempAWSCredentials(userType, credentials);
    },
    onFailure: (err) => {
      console.log(err);
    },
  });
}
