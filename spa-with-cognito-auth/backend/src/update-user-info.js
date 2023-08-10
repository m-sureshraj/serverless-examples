import {
    CognitoIdentityProviderClient,
    UpdateUserAttributesCommand,
} from "@aws-sdk/client-cognito-identity-provider";

import { getAccessTokenFromReqContext } from './lib/util.js'
import { BadRequestError, withErrorHandler } from './lib/http-error.js'

const client = new CognitoIdentityProviderClient({});

const supportedUserAttributes = ['given_name', 'family_name', 'custom:company']

function mapUserAttributes(payload) {
    return Object.entries(payload).map(([key, value]) => ({ Name: key, Value: value }))
}

const updateUserInfo = async (event) => {
    const accessToken = getAccessTokenFromReqContext(event)
    const payload = JSON.parse(event.body ?? '{}')

    // A basic validation to keep it simple. It can be improved using libs such as Zod, Joi, or etc.
    // - throw error if the payload is empty
    // - throw error if unknown attribute(s) present in the payload

    const userAttributes = Object.keys(payload)
    if (userAttributes.length === 0) {
        throw new BadRequestError('The provided data is empty')
    }

    const unknownAttributes = userAttributes.filter(attr => !supportedUserAttributes.includes(attr))
    if (unknownAttributes.length) {
        throw new BadRequestError(`Unknown user attribute(s) [${unknownAttributes.join(', ')}] provided`)
    }

    const command = new UpdateUserAttributesCommand({
        AccessToken: accessToken,
        UserAttributes: mapUserAttributes(payload)
    })

    console.info('Updating user info...')
    await client.send(command)
    console.info('User info updated')

    return {
        statusCode: 200,
        body: JSON.stringify({}),
        headers: {
            'content-type': 'application/json'
        }
    }
}

export const handler = withErrorHandler(updateUserInfo)
