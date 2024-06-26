// https://www.maxivanov.io/aws-cognito-amplify-vs-amazon-cognito-identity-js-vs-aws-sdk/
import {
  CognitoUserPool,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";

import {
  getUserPoolConfig,
  getSessionUser,
  parseCommandLineArgs,
} from "./util.js";

const { userType } = parseCommandLineArgs();
signUp(userType);

// Registers a user with the application.
// The UserPool client is configured to support only Secure Remote Password (SRP) authentication for enhanced security.
// The `amazon-cognito-identity-js` lib handles this part internally
function signUp(userType) {
  const poolData = getUserPoolConfig();
  const sessionUser = getSessionUser(userType);

  const attributeList = [
    new CognitoUserAttribute({
      Name: "given_name",
      Value: sessionUser.givenName,
    }),
  ];
  const validationData = null;

  console.log(`signing up user: ${sessionUser.username}`);

  const userPool = new CognitoUserPool(poolData);
  userPool.signUp(
    sessionUser.username,
    sessionUser.password,
    attributeList,
    validationData,
    (err, result) => {
      if (err) {
        console.error(err.message || JSON.stringify(err));
        return;
      }

      console.log(`User: "${result.user.getUsername()}" was created`);
    },
  );
}
