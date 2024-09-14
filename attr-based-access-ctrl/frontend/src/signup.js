// https://www.maxivanov.io/aws-cognito-amplify-vs-amazon-cognito-identity-js-vs-aws-sdk/
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

import {
  getSessionUser,
  parseCommandLineArgs,
} from "./util.js";
import awsConfig from "../config/aws.json" assert { type: "json" };

const { userType } = parseCommandLineArgs();
await signUp(userType);

// Registers a user with the application
async function signUp(userType) {
  const client = new CognitoIdentityProviderClient({
    region: awsConfig.region,
  });

  const sessionUser = getSessionUser(userType);

  const command = new SignUpCommand({
    ClientId: awsConfig.userPoolClientId,
    Username: sessionUser.username,
    Password: sessionUser.password,
    UserAttributes: [
      {
        Name: "given_name", // it's a required attribute during sign-up
        Value: sessionUser.givenName,
      },
    ],
  });

  try {
    console.log(`signing up the user: ${sessionUser.username}`);
    const response = await client.send(command);
    console.log('User account was successfully created');

    if (response.UserConfirmed === false) {
      // the user pool is configured to send a confirmation code to the user's email
      console.log(`The user account requires confirmation; a confirmation code was sent to your email: ${response.CodeDeliveryDetails.Destination}`);
    }
  } catch (error) {
    console.error("An error occurred while signing up the user:", error);
  }
}
