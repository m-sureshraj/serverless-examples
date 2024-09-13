import { confirmSignUp } from "aws-amplify/auth";

import {
  getSessionUser,
  parseCommandLineArgs,
  configureAmplify,
} from "./util.js";

const { userType, confirmationCode } = parseCommandLineArgs();
if (!confirmationCode) {
  throw new Error(
    "Required argument 'confirmationCode' is missing. Usage: npm run confirm user=<free|premium> confirmationCode=<code>",
  );
}

configureAmplify();

await confirmRegistration(userType, confirmationCode);

// Confirms a user using a confirmation code received via email after registration (signup).
async function confirmRegistration(userType, confirmationCode) {
  const { username } = getSessionUser(userType);

  try {
    await confirmSignUp({
      confirmationCode,
      username,
    });
    console.log(`User: "${username}" was confirmed`);
  } catch (error) {
    console.error("An error occurred while confirming the user:", error);
  }
}
