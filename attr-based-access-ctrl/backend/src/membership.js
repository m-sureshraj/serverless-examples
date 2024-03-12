import { CognitoIdentityProviderClient, AdminUpdateUserAttributesCommand } from "@aws-sdk/client-cognito-identity-provider";

const userPoolId = process.env.COGNITO_USER_POOL_ID;

const client = new CognitoIdentityProviderClient();

/*
The `event.requestContext.authorizer.iam.cognitoIdentity` object has the following keys:
{
  amr: [
    'authenticated',
    'cognito-idp.eu-west-1.amazonaws.com/<user-pool-id>',
    'cognito-idp.eu-west-1.amazonaws.com/<user-pool-id>:CognitoSignIn:<user-id-assigned-by-the-user-pool>'
  ],
  identityId: 'identityId',
  identityPoolId: 'identityPoolId',
}
* */

//
function getUserId(event) {
  const authProvider = event.requestContext.authorizer.iam.cognitoIdentity.amr.findLast(item => item.includes(':CognitoSignIn:'));
  const parts = authProvider.split(':');

  // last element is the user id
  return parts[parts.length - 1]
}

// Updates the specified user's attributes, as an administrator. Works on any user.
// For custom attributes, you must prepend the custom: prefix to the attribute name.
// Amazon Cognito evaluates (IAM) policies in requests for this API operation.
// The function requires `cognito-idp:AdminUpdateUserAttributes` permission to update user attributes.
// This custom attribute is read-only for the user but can be updated by the application itself, which acts as an administrator.

export async function handler(event) {
  console.log("handling membership request to become a premium user", event);

  const userId = getUserId(event);
  console.log("userId", userId);

  try {
    // payment processing logic goes here
    console.log('processing payment...');

    // if the payment was successful, update the user's membership
    console.log('payment successful, updating user\'s membership...');

    const command = new AdminUpdateUserAttributesCommand({
      UserPoolId: userPoolId,
      Username: userId,
      UserAttributes: [
        {
          Name: "custom:membership",
          Value: "premium",
        },
      ],
    });
    const response = await client.send(command);
    console.log('membership successfully updated', response);

    return {
      statusCode: 200,
      body: JSON.stringify({
          message: 'Membership updated successfully',
      }),
    };
  } catch (error) {
    console.log("error", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message ?? 'Unknown error',
      }),
    }
  }
}
