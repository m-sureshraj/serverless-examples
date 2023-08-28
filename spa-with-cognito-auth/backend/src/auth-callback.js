import querystring from 'node:querystring';

import { BadRequestError } from './lib/http-error';
import { config } from './lib/config.js';

const { appDomain } = config;

const headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
};

export const handler = async event => {
  const { code = '' } = event.queryStringParameters ?? {};
  if (!code) {
    throw new BadRequestError('Missing code parameter');
  }

  const qs = querystring.stringify({
    grant_type: 'authorization_code',
    redirect_uri: config.authCallbackUrl,
    code: code,
    client_id: config.userPoolClientId,
  });

  console.log(`Exchanging code: ${code} for token`);
  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: headers,
    body: qs,
  });
  const responseBody = await response.json();

  if (!response.ok) {
    console.error('Failed to exchange code for token', responseBody);

    return {
      statusCode: 302,
      headers: {
        Location: `${appDomain}?error=auth_failed`,
      },
    };
  }

  console.log(`Successfully exchanged code: ${code} for token`);
  const cookieOptions = [
    `accessToken=${responseBody.access_token}`,
    'HttpOnly',
    'SameSite=Strict',
    'Secure',
  ];

  console.log(`Redirecting the user to ${appDomain}`);
  return {
    statusCode: 302,
    headers: {
      Location: appDomain,
      'Set-Cookie': `${cookieOptions.join(';')}`,
    },
  };
};
