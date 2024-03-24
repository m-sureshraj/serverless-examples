import { promisify } from "node:util";

import { CognitoUserPool, CognitoUser } from "amazon-cognito-identity-js";

import { getSessionUser, getUserPoolConfig } from "./util.js";

// Confirms a registered, unauthenticated user using a confirmation code received via email.
export async function confirmRegistration(userType, confirmationCode) {
  const sessionUser = getSessionUser(userType);
  const poolData = getUserPoolConfig();
  const userPool = new CognitoUserPool(poolData);

  const cognitoUser = new CognitoUser({
    Username: sessionUser.username,
    Pool: userPool,
  });
  const confirmRegistration = promisify(cognitoUser.confirmRegistration).bind(
    cognitoUser,
  );

  await confirmRegistration(confirmationCode);
  console.log("User was confirmed");
}
