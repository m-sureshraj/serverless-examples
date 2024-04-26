import { CognitoUserPool, CognitoUser } from "amazon-cognito-identity-js";

import {
  getSessionUser,
  getUserPoolConfig,
  parseCommandLineArgs,
} from "./util.js";

const { userType, confirmationCode } = parseCommandLineArgs();
if (!confirmationCode) {
  throw new Error(
    "Required argument 'confirmationCode' is missing. Usage: npm run confirm user=<free|premium> confirmationCode=<code>",
  );
}

confirmRegistration(userType, confirmationCode);

// Confirms a registered, unauthenticated user using a confirmation code received via email.
function confirmRegistration(userType, confirmationCode) {
  const sessionUser = getSessionUser(userType);
  const poolData = getUserPoolConfig();
  const userPool = new CognitoUserPool(poolData);

  const cognitoUser = new CognitoUser({
    Username: sessionUser.username,
    Pool: userPool,
  });

  const forceAliasCreation = false;
  cognitoUser.confirmRegistration(
    confirmationCode,
    forceAliasCreation,
    (err, result) => {
      if (err) {
        console.error(err.message || JSON.stringify(err));
        return;
      }

      console.log(`User: "${cognitoUser.getUsername()}" was confirmed`);
    },
  );
}
