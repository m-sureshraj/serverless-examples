import {
    CognitoIdentityProviderClient,
    GlobalSignOutCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { getAccessTokenFromReqContext } from "./lib/util.js";

const client = new CognitoIdentityProviderClient({});

export const handler = async (event) => {
    const accessToken = getAccessTokenFromReqContext(event)

    const command = new GlobalSignOutCommand({
        AccessToken: accessToken
    })

    try {
        await client.send(command);
        console.info('Invalidated all identity, access and refresh tokens that Amazon Cognito has issued to a user')
    } catch (error) {
        console.error('An error occurred while trying to invalidate the identity, access and refresh tokens', error)
    }

    // clear the accessToken cookie regardless of the previous actions' outcome so the user will be signed out from the application.
    const cookieOptions = [
        'accessToken=',
        'HttpOnly',
        'SameSite=Strict',
        'Secure',
        `Expires=${new Date(1)}` // A random past date; 1 second after 1/1/1970
    ]

    return {
        statusCode: 200,
        body: JSON.stringify({}),
        headers: {
            'content-type': 'application/json',
            'Set-Cookie': `${cookieOptions.join(';')}`
        }
    }
}
