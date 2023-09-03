import { config } from './lib/config.js';

export const handler = async () => {
  const qs = [
    `client_id=${config.userPoolClientId}`,
    'response_type=code',
    `scope=email+openid+profile+aws.cognito.signin.user.admin`,
    `redirect_uri=${config.authCallbackUrl}`,
  ];
  const loginUrl = `${config.loginUrl}?${qs.join('&')}`;

  console.log(`Redirecting to the Cognito hosted login page: ${loginUrl}`);
  return {
    statusCode: 302,
    headers: {
      Location: loginUrl,
    },
  };
};
