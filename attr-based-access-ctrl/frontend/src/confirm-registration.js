import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

import { getSessionUser, parseCommandLineArgs } from "./util.js";
import awsConfig from "../config/aws.json" assert { type: "json" };

const { userType, confirmationCode } = parseCommandLineArgs();
if (!confirmationCode) {
  throw new Error(
    "Required argument 'confirmationCode' is missing. Usage: npm run confirm user=<free|premium> confirmationCode=<code>",
  );
}

await confirmRegistration(userType, confirmationCode);

// Confirms a user using a confirmation code received via email after registration (signup).
async function confirmRegistration(userType, confirmationCode) {
  const client = new CognitoIdentityProviderClient({
    region: awsConfig.region,
  });

  const { username } = getSessionUser(userType);

  const command = new ConfirmSignUpCommand({
    ClientId: awsConfig.userPoolClientId,
    Username: username,
    ConfirmationCode: confirmationCode,
  });

  try {
    await client.send(command);
    console.log(`User: "${username}" was confirmed`);
  } catch (error) {
    console.error('An error occurred while confirming the user:', error);
  }
}
