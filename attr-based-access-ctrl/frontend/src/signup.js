import { signUp } from "aws-amplify/auth";

import {
  getSessionUser,
  parseCommandLineArgs,
  configureAmplify,
} from "./util.js";

configureAmplify();

const { userType } = parseCommandLineArgs();
await handleSignUp(userType);

// Registers a user with the application
async function handleSignUp(userType) {
  const sessionUser = getSessionUser(userType);

  try {
    console.log(`signing up the user: ${sessionUser.username}`);
    const response = await signUp({
      username: sessionUser.username,
      password: sessionUser.password,
      options: {
        userAttributes: {
          given_name: sessionUser.givenName,
        },
      },
    });
    console.log("User account was successfully created");

    // the user pool is configured to send a confirmation code to the user's email
    const maskedEmail = response.nextStep.codeDeliveryDetails.destination;
    console.log(
      `The user account requires confirmation; a confirmation code was sent to your email: ${maskedEmail}`,
    );
  } catch (error) {
    console.error("An error occurred while signing up the user:", error);
  }
}
