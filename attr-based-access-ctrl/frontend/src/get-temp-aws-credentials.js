import {
  CognitoIdentityClient,
  GetCredentialsForIdentityCommand,
  GetIdCommand,
} from "@aws-sdk/client-cognito-identity";

import awsConfig from "../config/aws.json" assert { type: "json" };

export async function getTempAWSCredentials(tokens) {
  const client = new CognitoIdentityClient({ region: awsConfig.region });

  // retrieves the Identity ID using the ID token
  const key = `cognito-idp.${awsConfig.region}.amazonaws.com/${awsConfig.userPoolId}`;

  const getIdCommand = new GetIdCommand({
    IdentityPoolId: awsConfig.identityPoolId,
    Logins: {
      [key]: tokens.idToken,
    },
  });
  const { IdentityId } = await client.send(getIdCommand);

  // retrieves temporary credentials using the Identity ID
  const getCredForIdentityCommand = new GetCredentialsForIdentityCommand({
    IdentityId,
    Logins: {
      [key]: tokens.idToken,
    },
  });
  const { Credentials } = await client.send(getCredForIdentityCommand);

  return {
    accessKeyId: Credentials.AccessKeyId,
    secretAccessKey: Credentials.SecretKey,
    sessionToken: Credentials.SessionToken,
  };
}
