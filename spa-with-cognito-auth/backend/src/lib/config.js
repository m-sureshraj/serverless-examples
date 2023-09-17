const { USER_POOL_ID, USER_POOL_CLIENT_ID, COGNITO_DOMAIN } = process.env;

// The FE will be served in localhost:5173 during the local development
const appDomain = process.env.IS_OFFLINE
  ? 'http://localhost:5173'
  : process.env.APP_DOMAIN;

// In offline mode, the api will be served in localhost:3000
const apiDomain = process.env.IS_OFFLINE ? 'http://localhost:3000' : appDomain;

export const config = {
  userPoolId: USER_POOL_ID,
  userPoolClientId: USER_POOL_CLIENT_ID,

  appDomain,
  authCallbackUrl: `${apiDomain}/api/auth-callback`,

  // cognito oauth endpoints
  loginUrl: `${COGNITO_DOMAIN}/login`,
  signupUrl: `${COGNITO_DOMAIN}/signup`,
  tokenUrl: `${COGNITO_DOMAIN}/oauth2/token`,
  userInfoUrl: `${COGNITO_DOMAIN}/oauth2/userInfo`,
};
