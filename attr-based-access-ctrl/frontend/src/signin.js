import { signIn, fetchAuthSession } from "aws-amplify/auth";

import {
  writeTokens,
  parseCommandLineArgs,
  writeTempAWSCredentials,
  configureAmplify,
} from "./util.js";
import { getTempAWSCredentials } from "./get-temp-aws-credentials.js";
import usersConfig from "../config/users.json" assert { type: "json" };

configureAmplify();

const { userType } = parseCommandLineArgs();
const sessionUser = usersConfig[userType];

await handleSignIn();

// Logs the user into the application
// The UserPool client is configured to support only Secure Remote Password (SRP) authentication flow for enhanced security
//  and the `aws-amplify/auth` lib handles this part internally
async function handleSignIn() {
  try {
    await signIn({
      username: sessionUser.username,
      password: sessionUser.password,
    });

    const authSession = await fetchAuthSession();
    console.log("successfully signed in");

    const tokens = {
      accessToken: authSession.tokens.accessToken.toString(),
      idToken: authSession.tokens.idToken.toString(),
    };
    await writeTokens(userType, tokens);

    console.log("getting temporary AWS credentials from Cognito Identity Pool");
    const credentials = await getTempAWSCredentials(tokens);
    await writeTempAWSCredentials(userType, credentials);
  } catch (error) {
    console.error("An error occurred while signing in the user:", error);
  }
}
