import { config } from './lib/config.js';

export const handler = async event => {
  const { hint } = event.queryStringParameters ?? {};

  const url = hint === 'signup' ? config.signupUrl : config.loginUrl;
  const qs = [
    `client_id=${config.userPoolClientId}`,
    'response_type=code',
    `scope=email+openid+profile+aws.cognito.signin.user.admin`,
    `redirect_uri=${config.authCallbackUrl}`,
  ];
  const authUrl = `${url}?${qs.join('&')}`;

  console.log(`Redirecting to the Cognito hosted login/signup page: ${authUrl}`);
  return {
    statusCode: 302,
    headers: {
      Location: authUrl,
    },
  };
};
