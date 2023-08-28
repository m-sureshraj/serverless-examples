import { CognitoJwtVerifier } from 'aws-jwt-verify';

import { config } from './lib/config.js';

const verifier = CognitoJwtVerifier.create({
  userPoolId: config.userPoolId,
  tokenUse: 'access',
  clientId: config.userPoolClientId,
});

function getAccessTokenFromCookies(cookiesArray = []) {
  // cookiesArray = ['accessToken=xxx', 'foo=bar']
  const cookieString =
    cookiesArray.find(cookie => cookie.startsWith('accessToken=')) ?? '';
  const [, accessToken] = cookieString.split('=');

  // returns the value of the access token or undefined
  return accessToken;
}

const unauthorizedResponse = {
  isAuthorized: false, // the key name must be `isAuthorized` and the value should be boolean
  context: {},
};

export const handler = async event => {
  // cookies header is the identitySource
  const accessToken = getAccessTokenFromCookies(event.identitySource);
  if (!accessToken) {
    console.error('Failed to extract the access token from the cookie header');
    return unauthorizedResponse;
  }

  try {
    const payload = await verifier.verify(accessToken);

    return {
      isAuthorized: true,
      context: { payload, accessToken },
    };
  } catch (error) {
    console.error('Access token is not valid:', error);
    return unauthorizedResponse;
  }
};
