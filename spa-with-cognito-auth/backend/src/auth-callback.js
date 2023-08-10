import querystring from "node:querystring";

import { BadRequestError } from './lib/http-error'

const clientId = process.env.USER_POOL_CLIENT_ID
const cognitoDomain = process.env.COGNITO_DOMAIN

const tokenUrl = `${cognitoDomain}/oauth2/token`;
const appDomain = process.env.IS_OFFLINE ? 'http://localhost:5173' : process.env.APP_DOMAIN
const apiDomain = process.env.IS_OFFLINE ? 'http://localhost:3000' : appDomain
const authCallbackUrl = `${apiDomain}/api/auth-callback`

const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
};

export const handler = async (event) => {
    const { code = '' } = event.queryStringParameters ?? {};
    if (!code) {
        throw new BadRequestError('Missing code parameter')
    }

    const qs = querystring.stringify({
        grant_type: 'authorization_code',
        redirect_uri: authCallbackUrl,
        code: code,
        client_id: clientId,
    })

    console.log(`Exchanging code: ${code} for token`)
    const response = await fetch(tokenUrl, {
        method: "POST",
        headers: headers,
        body: qs
    });
    const responseBody = await response.json();

    if (!response.ok) {
        console.error('Failed to exchange code for token', responseBody)

        return {
            statusCode: 302,
            headers: {
                'Location': `${appDomain}?error=auth_failed`,
            }
        };
    }

    console.log(`Successfully exchanged code: ${code} for token`)
    const cookieOptions = [
        `accessToken=${responseBody.access_token}`,
        'HttpOnly',
        'SameSite=Strict',
        'Secure',
    ]

    console.log(`Redirecting the user to ${appDomain}`)
    return {
        statusCode: 302,
        headers: {
            'Location': appDomain,
            'Set-Cookie': `${cookieOptions.join(';')}`
        }
    };
}
