import { getAccessTokenFromReqContext } from "./lib/util.js";
import { withErrorHandler, HttpError } from './lib/http-error'

const cognitoDomain = process.env.COGNITO_DOMAIN
const userInfoUrl = `${cognitoDomain}/oauth2/userInfo`;

export const getUserInfo = async (event) => {
    const accessToken = getAccessTokenFromReqContext(event)
    const headers = {
        Authorization: `Bearer ${accessToken}`,
    };

    const response = await fetch(userInfoUrl, {
        method: 'GET',
        headers: headers,
    });
    const responseBody = await response.json();

    if (!response.ok) {
        console.error('An error occurred while fetching the user information', responseBody)
        throw new HttpError(responseBody.error_description, response.status)
    }

    return {
        statusCode: 200,
        body: JSON.stringify(responseBody),
        headers: {
            'content-type': 'application/json'
        }
    }
}

export const handler = withErrorHandler(getUserInfo)
