import { promisify } from "node:util";

// https://www.maxivanov.io/aws-cognito-amplify-vs-amazon-cognito-identity-js-vs-aws-sdk/
import {
  CognitoUserPool,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";

import { getUserPoolConfig, getSessionUser } from './util.js'

// Registers a user with the application. The UserPool client supports only SRP authentication.
// The `amazon-cognito-identity-js` lib handles this part internally
export async function signUp(userType) {
  const poolData = getUserPoolConfig();
  const sessionUser = getSessionUser(userType);

  console.log("signing up..");
  const attributeList = [
    new CognitoUserAttribute({
      Name: "given_name",
      Value: sessionUser.givenName,
    }),
  ];

  const userPool = new CognitoUserPool(poolData);
  const signUp = promisify(userPool.signUp).bind(userPool);
  const validationData = null;

  const res = await signUp(
    sessionUser.username,
    sessionUser.password,
    attributeList,
    validationData,
  );
  const cognitoUser = res.user;

  console.log(`User "${cognitoUser.getUsername()}" was created`);
}
