import { promisify } from "node:util";

// https://www.maxivanov.io/aws-cognito-amplify-vs-amazon-cognito-identity-js-vs-aws-sdk/
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
import AWS from "aws-sdk";

import {
  writeTempAWSCredentials,
  writeTokens,
  getUserPoolConfig,
  parseCommandLineArgs,
} from "./util.js";
import awsConfig from "../config/aws.json" assert { type: "json" };
import usersConfig from "../config/users.json" assert { type: "json" };

const { userType } = parseCommandLineArgs();
const sessionUser = usersConfig[userType];

await signIn(getCredentials);

async function signIn(getCredentials) {
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

      console.log("getting credentials from Cognito Identity Pool");
      await getCredentials(tokens);
    },
    onFailure: (err) => {
      console.log(err);
    },
  });
}

async function getCredentials(tokens) {
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

  const accessKeyId = AWSCredentials.accessKeyId;
  const secretAccessKey = AWSCredentials.secretAccessKey;
  const sessionToken = AWSCredentials.sessionToken;
  await writeTempAWSCredentials(userType, {
    accessKeyId,
    secretAccessKey,
    sessionToken,
  });
}
